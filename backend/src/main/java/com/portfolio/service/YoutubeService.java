package com.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class YoutubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private static final int MAX_COMMENTS = 1000;
    private static final int PAGE_SIZE    = 100;
    private static final String BASE_URL  = "https://www.googleapis.com/youtube/v3";

    private final ObjectMapper mapper     = new ObjectMapper();
    private final HttpClient   httpClient = HttpClient.newHttpClient();

    // ── 댓글 수집 ─────────────────────────────────────────
    public ObjectNode fetchComments(String videoId) throws Exception {
        String videoTitle = fetchVideoTitle(videoId);
        List<ObjectNode> comments = new ArrayList<>();
        String pageToken = null;
        int totalCount = 0;

        do {
            String url = BASE_URL + "/commentThreads"
                    + "?part=snippet"
                    + "&videoId=" + videoId
                    + "&maxResults=" + PAGE_SIZE
                    + "&order=relevance"
                    + "&key=" + apiKey
                    + (pageToken != null ? "&pageToken=" + pageToken : "");

            JsonNode res = get(url);

            if (totalCount == 0) {
                totalCount = res.path("pageInfo").path("totalResults").asInt();
            }

            for (JsonNode item : res.path("items")) {
                JsonNode snippet = item.path("snippet").path("topLevelComment").path("snippet");
                ObjectNode c = mapper.createObjectNode();
                c.put("id",          item.path("id").asText());
                c.put("author",      snippet.path("authorDisplayName").asText());
                c.put("text",        snippet.path("textDisplay").asText());
                c.put("likeCount",   snippet.path("likeCount").asInt());
                c.put("publishedAt", snippet.path("publishedAt").asText());
                c.put("updatedAt",   snippet.path("updatedAt").asText());
                c.put("replyCount",  item.path("snippet").path("totalReplyCount").asInt());
                comments.add(c);
            }

            pageToken = res.path("nextPageToken").isMissingNode()
                    ? null : res.path("nextPageToken").asText();

            log.debug("댓글 수집 중: {}개", comments.size());

        } while (pageToken != null && comments.size() < MAX_COMMENTS);

        ObjectNode result = mapper.createObjectNode();
        result.put("videoTitle", videoTitle);
        result.put("total", totalCount);
        ArrayNode arr = mapper.createArrayNode();
        comments.forEach(arr::add);
        result.set("comments", arr);
        return result;
    }

    // ── 답글 수집 (클릭 시 호출) ──────────────────────────
    public ObjectNode fetchReplies(String commentId) throws Exception {
        String url = BASE_URL + "/comments"
                + "?part=snippet"
                + "&parentId=" + commentId
                + "&maxResults=100"
                + "&key=" + apiKey;

        JsonNode res = get(url);
        List<ObjectNode> replies = new ArrayList<>();

        for (JsonNode item : res.path("items")) {
            JsonNode snippet = item.path("snippet");
            ObjectNode r = mapper.createObjectNode();
            r.put("id",          item.path("id").asText());
            r.put("author",      snippet.path("authorDisplayName").asText());
            r.put("text",        snippet.path("textDisplay").asText());
            r.put("likeCount",   snippet.path("likeCount").asInt());
            r.put("publishedAt", snippet.path("publishedAt").asText());
            replies.add(r);
        }

        ObjectNode result = mapper.createObjectNode();
        ArrayNode arr = mapper.createArrayNode();
        replies.forEach(arr::add);
        result.set("replies", arr);
        return result;
    }

    // ── 영상 제목 ─────────────────────────────────────────
    private String fetchVideoTitle(String videoId) {
        try {
            String url = BASE_URL + "/videos"
                    + "?part=snippet"
                    + "&id=" + videoId
                    + "&key=" + apiKey;
            JsonNode res = get(url);
            JsonNode items = res.path("items");
            if (items.size() == 0) return "";
            return items.get(0).path("snippet").path("title").asText("");
        } catch (Exception e) {
            log.warn("영상 제목 조회 실패: {}", e.getMessage());
            return "";
        }
    }

    // ── HTTP GET ──────────────────────────────────────────
    private JsonNode get(String url) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();
        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (res.statusCode() != 200) {
            JsonNode err = mapper.readTree(res.body());
            String msg = err.path("error").path("message").asText("YouTube API 오류: " + res.statusCode());
            throw new RuntimeException(msg);
        }
        return mapper.readTree(res.body());
    }
}
