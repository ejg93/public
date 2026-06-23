package com.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class JobService {

    @Value("${saramin.access.key:}")
    private String saraminKey;

    @Value("${kakao.rest.key:}")
    private String kakaoKey;

    // 서울시 중랑구 동일로 143길 70-10
    private static final double USER_LAT = 37.5966;
    private static final double USER_LNG = 127.0869;

    private static final String SARAMIN_URL      = "https://oapi.saramin.co.kr/job-search";
    private static final String KAKAO_KEYWORD_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";

    private final ObjectMapper mapper     = new ObjectMapper();
    private final HttpClient   httpClient = HttpClient.newHttpClient();

    public ObjectNode fetchJobs() throws Exception {
        if (saraminKey == null || saraminKey.isBlank()) {
            ObjectNode err = mapper.createObjectNode();
            err.put("error", "SARAMIN_ACCESS_KEY not set");
            err.set("jobs", mapper.createArrayNode());
            return err;
        }

        String url = SARAMIN_URL
                + "?access-key=" + saraminKey
                + "&job_mid_cd=2&loc_mcd=101000&count=30&sort=pd";

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Accept", "application/json")
                .GET()
                .build();
        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (res.statusCode() != 200) {
            throw new RuntimeException("Saramin API " + res.statusCode());
        }

        JsonNode data    = mapper.readTree(res.body());
        JsonNode rawJobs = data.path("jobs").path("job");

        // 1차: 모든 공고 수집
        List<ObjectNode> jobList = new ArrayList<>();
        for (JsonNode raw : rawJobs) {
            jobList.add(buildJob(raw));
        }

        // 반복공고 감지: 동일 회사 공고 수 카운트
        Map<String, Integer> companyCount = new HashMap<>();
        for (ObjectNode job : jobList) {
            String co = job.path("company").asText();
            companyCount.merge(co, 1, Integer::sum);
        }
        for (ObjectNode job : jobList) {
            job.put("repeatCount", companyCount.getOrDefault(job.path("company").asText(), 1));
        }

        ArrayNode jobs = mapper.createArrayNode();
        jobList.forEach(jobs::add);

        ObjectNode out = mapper.createObjectNode();
        out.set("jobs", jobs);
        return out;
    }

    private ObjectNode buildJob(JsonNode raw) {
        String locationRaw = raw.path("position").path("location").path("name").asText("");
        String location    = locationRaw.replace("&gt;", " ").replaceAll("\\s+", " ").trim();

        String salaryName = raw.path("salary").path("name").asText("협의");
        int    salaryMin  = parseSalaryMin(salaryName);
        int    expMin     = raw.path("position").path("experience-level").path("min").asInt(0);

        ObjectNode job = mapper.createObjectNode();
        job.put("id",        raw.path("id").asText(""));
        job.put("url",       raw.path("url").asText(""));
        job.put("company",   raw.path("company").path("detail").path("name").asText(""));
        job.put("title",     raw.path("position").path("title").asText(""));
        job.put("location",  location);
        job.put("salary",    salaryName);
        job.put("salaryMin", salaryMin);
        job.put("expMin",    expMin);
        job.put("expName",   raw.path("position").path("experience-level").path("name").asText("경력무관"));
        job.put("education", raw.path("position").path("required-education-level").path("name").asText(""));
        job.put("jobType",   raw.path("position").path("job-type").path("name").asText(""));

        if (!location.isBlank()) {
            try {
                double[] coords = geocode(location);
                if (coords != null) {
                    job.put("lat",      coords[0]);
                    job.put("lng",      coords[1]);
                    double dist = haversine(USER_LAT, USER_LNG, coords[0], coords[1]);
                    job.put("distance", Math.round(dist * 10.0) / 10.0);
                }
            } catch (Exception e) {
                log.warn("지오코딩 실패: {} - {}", location, e.getMessage());
            }
        }

        if (!job.has("lat")) {
            job.putNull("lat");
            job.putNull("lng");
            job.putNull("distance");
        }

        return job;
    }

    private double[] geocode(String query) throws Exception {
        String url = KAKAO_KEYWORD_URL
                + "?query=" + URLEncoder.encode(query, StandardCharsets.UTF_8)
                + "&size=1";
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "KakaoAK " + kakaoKey)
                .GET()
                .build();
        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (res.statusCode() != 200) return null;
        JsonNode docs = mapper.readTree(res.body()).path("documents");
        if (docs.isEmpty()) return null;
        return new double[]{ docs.get(0).path("y").asDouble(), docs.get(0).path("x").asDouble() };
    }

    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        final double R    = 6371;
        double       dLat = Math.toRadians(lat2 - lat1);
        double       dLng = Math.toRadians(lng2 - lng1);
        double       a    = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.asin(Math.sqrt(a));
    }

    private int parseSalaryMin(String name) {
        StringBuilder sb       = new StringBuilder();
        boolean       inNumber = false;
        for (char c : name.toCharArray()) {
            if (Character.isDigit(c)) {
                sb.append(c);
                inNumber = true;
            } else if (c == ',' && inNumber) {
                // 천단위 구분자 스킵
            } else if (inNumber) {
                break;
            }
        }
        if (sb.isEmpty()) return 0;
        try { return Integer.parseInt(sb.toString()); }
        catch (NumberFormatException e) { return 0; }
    }
}
