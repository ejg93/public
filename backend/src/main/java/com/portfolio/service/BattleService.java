package com.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.portfolio.dto.BattleRequest;
import com.portfolio.dto.BattleResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class BattleService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    private static final String ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
    private static final String ANTHROPIC_VERSION = "2023-06-01";
    private static final int MAX_TOKENS = 400;

    // 변경 전
//    private static final String MODEL_OPUS   = "claude-opus-4-5";
//    private static final String MODEL_SONNET = "claude-sonnet-4-5";

    // 변경 후
    private static final String MODEL_OPUS   = "claude-haiku-4-5-20251001";
    private static final String MODEL_SONNET = "claude-haiku-4-5-20251001";


    private static final String SYSTEM_OPUS =
            "너는 논리적이고 냉철한 토론자다. " +
                    "데이터와 근거를 바탕으로 명확하게 주장하며, 감정보다 이성을 앞세운다. " +
                    "반드시 150자 이내로 완성된 문장으로 끝내라. " +
                    "150자가 넘어갈 것 같으면 핵심만 추려서 짧게 마무리해라. " +
                    "문장이 중간에 잘리는 것은 절대 허용되지 않는다." +
                    "문장이 길어지지않도록 반말을 쓰고 축약어를 써라.";

    private static final String SYSTEM_SONNET =
            "너는 창의적이고 감성적인 토론자다. " +
                    "공감과 스토리텔링으로 상대를 설득하며, 직관과 상상력을 중시한다. " +
                    "반드시 150자 이내로 완성된 문장으로 끝내라. " +
                    "150자가 넘어갈 것 같으면 핵심만 추려서 짧게 마무리해라. " +
                    "문장이 중간에 잘리는 것은 절대 허용되지 않는다." +
                    "문장이 길어지지않도록 반말을 쓰고 축약어를 써라.";

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public BattleResponse chat(BattleRequest req) throws Exception {
        String modelId = resolveModel(req.getModel());
        String systemPrompt = resolveSystem(req.getModel());

        ArrayNode messages = mapper.createArrayNode();
        if (req.getHistory() != null) {
            for (BattleRequest.Message m : req.getHistory()) {
                ObjectNode node = mapper.createObjectNode();
                node.put("role", m.getRole());
                node.put("content", m.getContent());
                messages.add(node);
            }
        }
        ObjectNode userNode = mapper.createObjectNode();
        userNode.put("role", "user");
        userNode.put("content", req.getUserMsg());
        messages.add(userNode);

        ObjectNode body = mapper.createObjectNode();
        body.put("model", modelId);
        body.put("max_tokens", MAX_TOKENS);
        body.put("system", systemPrompt);
        body.set("messages", messages);

        String requestBody = mapper.writeValueAsString(body);
        log.debug("Claude API 요청 - model: {}, userMsg: {}", modelId, req.getUserMsg());

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(ANTHROPIC_URL))
                .header("Content-Type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", ANTHROPIC_VERSION)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            log.error("Claude API 오류: {} - {}", response.statusCode(), response.body());
            throw new RuntimeException("Claude API 오류: " + response.statusCode());
        }

        JsonNode result = mapper.readTree(response.body());
        String reply = result.path("content").get(0).path("text").asText();
        int tokens = result.path("usage").path("output_tokens").asInt();

        log.debug("Claude API 응답 - tokens: {}, reply: {}", tokens, reply);
        return new BattleResponse(reply, tokens);
    }

    private String resolveModel(String model) {
        return "sonnet".equalsIgnoreCase(model) ? MODEL_SONNET : MODEL_OPUS;
    }

    private String resolveSystem(String model) {
        return "sonnet".equalsIgnoreCase(model) ? SYSTEM_SONNET : SYSTEM_OPUS;
    }
}