package bham.team.web.rest;

import bham.team.domain.Concert;
import bham.team.service.TicketmasterService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for interacting with the Ticketmaster API
 */
@RestController
@RequestMapping("/api/ticketmaster")
public class TicketmasterController {

    private final Logger log = LoggerFactory.getLogger(TicketmasterController.class);

    private final TicketmasterService ticketmasterService;

    public TicketmasterController(TicketmasterService ticketmasterService) {
        this.ticketmasterService = ticketmasterService;
    }

    /**
     * GET /api/ticketmaster/artist/{artistName} : Get concerts by artist name.
     *
     * @param artistName the artist name to search for
     * @param size the maximum number of results to return
     * @return the ResponseEntity with status 200 (OK) and list of concerts in the body
     */
    @GetMapping("/artist/{artistName}")
    public ResponseEntity<List<Concert>> getConcertsByArtist(@PathVariable String artistName, @RequestParam(defaultValue = "10") int size) {
        log.debug("REST request to get concerts for artist: {}", artistName);
        List<Concert> concerts = ticketmasterService.fetchAndSaveEventsByArtist(artistName, size);
        return ResponseEntity.ok(concerts);
    }

    /**
     * GET /api/ticketmaster/location : Get concerts by location.
     *
     * @param countryCode the country code (e.g. 'GB')
     * @param city optional city name
     * @param size the maximum number of results to return
     * @return the ResponseEntity with status 200 (OK) and list of concerts in the body
     */
    @GetMapping("/location")
    public ResponseEntity<List<Concert>> getConcertsByLocation(
        @RequestParam String countryCode,
        @RequestParam(required = false) String city,
        @RequestParam(defaultValue = "10") int size
    ) {
        log.debug("REST request to get concerts for location: {}, {}", countryCode, city);
        List<Concert> concerts = ticketmasterService.fetchAndSaveEventsByLocation(countryCode, city, size);
        return ResponseEntity.ok(concerts);
    }

    /**
     * GET /api/ticketmaster/refresh : Refresh global and local concerts.
     *
     * @return the ResponseEntity with status 200 (OK)
     */
    @GetMapping("/refresh")
    public ResponseEntity<Void> refreshConcerts(
        @RequestParam(required = false) String countryCode,
        @RequestParam(required = false) String city
    ) {
        log.debug("REST request to refresh concert data with country: {}, city: {}", countryCode, city);

        try {
            ticketmasterService.clearAllConcerts();

            int usSize = 15;
            int europeSize = 10;
            int asiaSize = 10;
            int localSize = 15;

            log.debug("Fetching US concerts with size: {}", usSize);
            List<Concert> usaConcerts = ticketmasterService.fetchAndSaveEventsByLocation("US", null, usSize);
            log.debug("Fetched {} US concerts", usaConcerts.size());

            log.debug("Fetching German concerts with size: {}", europeSize);
            List<Concert> europeConcerts = ticketmasterService.fetchAndSaveEventsByLocation("DE", null, europeSize);
            log.debug("Fetched {} German concerts", europeConcerts.size());

            log.debug("Fetching Japanese concerts with size: {}", asiaSize);
            List<Concert> asiaConcerts = ticketmasterService.fetchAndSaveEventsByLocation("JP", null, asiaSize);
            log.debug("Fetched {} Japanese concerts", asiaConcerts.size());

            // Local concerts
            String country = (countryCode != null && !countryCode.isEmpty()) ? countryCode : "GB";
            log.debug("Fetching local concerts for {} with size: {}", country, localSize);
            List<Concert> localConcerts = ticketmasterService.fetchAndSaveEventsByLocation(country, city, localSize);
            log.debug("Fetched {} local concerts", localConcerts.size());

            int totalConcerts = usaConcerts.size() + europeConcerts.size() + asiaConcerts.size() + localConcerts.size();
            log.info("Total concerts fetched: {}", totalConcerts);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error refreshing concerts: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/ticketmaster/refresh-by-artists : Refresh concerts specifically for given artists.
     *
     * @param artists Comma-separated list of artist names
     * @param countryCode Optional country code for local concerts
     * @param city Optional city name for local concerts
     * @return the ResponseEntity with status 200 (OK)
     */
    @GetMapping("/refresh-by-artists")
    public ResponseEntity<Void> refreshConcertsByArtists(
        @RequestParam String artists,
        @RequestParam(required = false) String countryCode,
        @RequestParam(required = false) String city
    ) {
        log.debug("REST request to refresh concert data for artists: {}", artists);

        try {
            ticketmasterService.clearAllConcerts();

            List<String> artistList = Arrays.asList(artists.split(","));
            List<Concert> allConcerts = new ArrayList<>();

            for (String artist : artistList) {
                log.debug("Fetching concerts for artist: {}", artist);
                List<Concert> artistConcerts = ticketmasterService.fetchAndSaveEventsByArtist(artist.trim(), 5);
                allConcerts.addAll(artistConcerts);
                log.debug("Fetched {} global concerts for artist {}", artistConcerts.size(), artist);

                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }

            if (countryCode != null && !countryCode.isEmpty()) {
                log.debug("Fetching local concerts for artists in country: {}, city: {}", countryCode, city);

                for (String artist : artistList) {
                    List<Concert> localArtistConcerts = ticketmasterService.fetchAndSaveEventsByArtistAndLocation(
                        artist.trim(),
                        countryCode,
                        city,
                        3
                    );
                    allConcerts.addAll(localArtistConcerts);
                    log.debug("Fetched {} local concerts for artist {} in {}", localArtistConcerts.size(), artist, countryCode);

                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            }

            log.info("Total artist-specific concerts fetched: {}", allConcerts.size());

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error refreshing concerts for artists: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
