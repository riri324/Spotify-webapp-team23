package bham.team.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class SpotifyProxyResource {

    private final Logger log = LoggerFactory.getLogger(SpotifyProxyResource.class);
    private final RestTemplate restTemplate;

    public SpotifyProxyResource() {
        this.restTemplate = new RestTemplate();
    }

    @GetMapping("/spotify/top-artists")
    public ResponseEntity<String> getTopArtists(
        @RequestParam String token,
        @RequestParam(required = false, defaultValue = "medium_term") String timeRange,
        @RequestParam(required = false, defaultValue = "10") Integer limit
    ) {
        try {
            String url = "https://api.spotify.com/v1/me/top/artists?limit=" + limit + "&time_range=" + timeRange;

            log.debug("REST request to proxy Spotify API: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);

            HttpEntity<String> entity = new HttpEntity<>("", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response;
        } catch (Exception e) {
            log.error("Error fetching Spotify artists: {}", e.getMessage());
            return ResponseEntity.status(500).body("{\"items\":[]}");
        }
    }
}
