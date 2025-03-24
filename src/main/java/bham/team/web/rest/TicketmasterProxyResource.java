package bham.team.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class TicketmasterProxyResource {

    private final Logger log = LoggerFactory.getLogger(TicketmasterProxyResource.class);
    private final RestTemplate restTemplate;
    private final String apiKey = "NOa1G8utoWSrmii8EzUh7NFkMoKnd2Ax";

    public TicketmasterProxyResource() {
        this.restTemplate = new RestTemplate();
    }

    @GetMapping("/ticketmaster/events")
    public ResponseEntity<String> getEvents(@RequestParam String keyword, @RequestParam(required = false) String countryCode) {
        try {
            String url = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + keyword + "&apikey=" + apiKey;

            if (countryCode != null && !countryCode.isEmpty()) {
                url += "&countryCode=" + countryCode;
            }

            log.debug("REST request to proxy Ticketmaster API: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0");
            HttpEntity<String> entity = new HttpEntity<>("", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response;
        } catch (Exception e) {
            log.error("Error fetching events: {}", e.getMessage());
            return ResponseEntity.status(500).body("{\"_embedded\":{\"events\":[]}}");
        }
    }

    @GetMapping("/ticketmaster/nearby")
    public ResponseEntity<String> getNearbyEvents(
        @RequestParam Double lat,
        @RequestParam Double lon,
        @RequestParam(required = false, defaultValue = "50") Integer radius
    ) {
        try {
            String url =
                "https://app.ticketmaster.com/discovery/v2/events.json" +
                "?apikey=" +
                apiKey +
                "&latlong=" +
                lat +
                "," +
                lon +
                "&radius=" +
                radius +
                "&classificationName=music" +
                "&sort=distance,asc";

            log.debug("REST request to proxy Ticketmaster nearby API: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0");
            HttpEntity<String> entity = new HttpEntity<>("", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response;
        } catch (Exception e) {
            log.error("Error fetching nearby events: {}", e.getMessage());
            return ResponseEntity.status(500).body("{\"_embedded\":{\"events\":[]}}");
        }
    }

    @GetMapping(value = "/ticketmaster/image", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getImage(@RequestParam String url) {
        log.info("REST request to proxy Ticketmaster image: {}", url);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0");
            headers.set("Accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8");
            headers.set("Referer", "https://www.ticketmaster.com/");

            HttpEntity<String> entity = new HttpEntity<>("", headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, byte[].class);

            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.IMAGE_JPEG).body(response.getBody());
        } catch (Exception e) {
            log.error("Error retrieving image from {}: {}", url, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
