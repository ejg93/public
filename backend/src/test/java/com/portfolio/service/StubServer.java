package com.portfolio.service;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

/**
 * 서비스가 부를 가짜 외부 API. JDK 에 딸린 HttpServer 라 의존성이 안 늘어난다.
 * 진짜 유튜브·사람인을 부르면 키가 있어야 하고, 할당량과 상대 쪽 사정에 따라 결과가 흔들린다.
 * 받은 요청을 그대로 모아 두므로 「무엇을 어떻게 불렀나」까지 확인할 수 있다.
 */
public class StubServer implements AutoCloseable {

    /** 경로별로 무엇을 돌려줄지. 요청 쿼리를 받아 [상태코드, 본문] 을 정한다 */
    public interface Handler extends Function<String, Object[]> {
    }

    private final HttpServer server;
    private final List<String> requests = new ArrayList<>();

    public StubServer() throws IOException {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.start();
    }

    /** 본문까지 봐야 하는 POST 용. 요청 쿼리와 본문을 받아 [상태코드, 본문] 을 정한다 */
    public interface PostHandler {
        Object[] apply(String query, String body);
    }

    public void onPost(String path, PostHandler handler) {
        server.createContext(path, exchange -> {
            String query = exchange.getRequestURI().getRawQuery();
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            synchronized (requests) {
                requests.add(exchange.getRequestURI().getPath() + "?" + (query == null ? "" : query));
            }
            Object[] answer = handler.apply(query == null ? "" : query, body);
            respond(exchange, (int) answer[0], String.valueOf(answer[1]));
        });
    }

    public void on(String path, Handler handler) {
        server.createContext(path, exchange -> {
            String query = exchange.getRequestURI().getRawQuery();
            synchronized (requests) {
                requests.add(exchange.getRequestURI().getPath() + "?" + (query == null ? "" : query));
            }
            Object[] answer = handler.apply(query == null ? "" : query);
            respond(exchange, (int) answer[0], String.valueOf(answer[1]));
        });
    }

    private void respond(com.sun.net.httpserver.HttpExchange exchange, int status, String text) throws IOException {
        byte[] body = text.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, body.length);
        try (OutputStream out = exchange.getResponseBody()) {
            out.write(body);
        }
    }

    /** 이 서버의 주소. 서비스의 base-url 자리에 넣는다 */
    public String url() {
        return "http://127.0.0.1:" + server.getAddress().getPort();
    }

    /** 지금까지 받은 요청. 「경로?쿼리」 형태고 쿼리는 인코딩된 그대로다 */
    public List<String> requests() {
        synchronized (requests) {
            return List.copyOf(requests);
        }
    }

    @Override
    public void close() {
        server.stop(0);
    }
}
