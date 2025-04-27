package bham.team.service;

import bham.team.domain.Concert;
import bham.team.repository.ConcertRepository;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@Transactional
public class TicketmasterService {

    private final Logger log = LoggerFactory.getLogger(TicketmasterService.class);

    private final ConcertRepository concertRepository;

    private final RestTemplate restTemplate;

    @Value("${application.ticketmaster.api-key:NOa1G8utoWSrmii8EzUh7NFkMoKnd2Ax}")
    private String apiKey;

    private final String BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

    public TicketmasterService(ConcertRepository concertRepository) {
        this.concertRepository = concertRepository;
        this.restTemplate = new RestTemplate();
    }

    public void clearAllConcerts() {
        concertRepository.deleteAll();
    }

    /**
     * Fetch events by artist name from Ticketmaster API and save to DB
     * @param artistName Artist name to search for
     * @param size Number of results to fetch
     * @return List of saved Concert entities
     */
    public List<Concert> fetchAndSaveEventsByArtist(String artistName, int size) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("apikey", apiKey)
                .queryParam("size", size)
                .queryParam("classificationName", "music");

            if (artistName != null && !artistName.isEmpty()) {
                builder.queryParam("keyword", artistName);
            } else {
                builder.queryParam("sort", "popularity,desc");
            }

            String url = builder.toUriString();
            log.debug("Ticketmaster API URL: {}", url);

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return processAndSaveConcerts(response);
        } catch (Exception e) {
            log.error("Error fetching events from Ticketmaster API: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Fetch events by location from Ticketmaster API and save to DB
     * @param countryCode Country code (e.g. 'GB' for United Kingdom)
     * @param city Optional city name
     * @param size Number of results to fetch
     * @return List of saved Concert entities
     */
    public List<Concert> fetchAndSaveEventsByLocation(String countryCode, String city, int size) {
        try {
            int validSize = Math.max(1, size);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("apikey", apiKey)
                .queryParam("countryCode", countryCode)
                .queryParam("classificationName", "music")
                .queryParam("size", validSize);

            if (city != null && !city.isEmpty()) {
                builder.queryParam("city", city);
            }

            String url = builder.toUriString();
            log.info("Calling Ticketmaster API with URL: {}", url);

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null) {
                log.warn("Received null response from Ticketmaster API");
                return Collections.emptyList();
            }

            if (response.containsKey("fault")) {
                log.error("Ticketmaster API error: {}", response);
                return Collections.emptyList();
            }

            return processAndSaveConcerts(response);
        } catch (Exception e) {
            log.error("Error fetching events from Ticketmaster API for location {}, {}: {}", countryCode, city, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Fetch events by both artist name and location from Ticketmaster API
     * @param artistName Artist name to search for
     * @param countryCode Country code (e.g. 'GB' for United Kingdom)
     * @param city Optional city name
     * @param size Number of results to fetch
     * @return List of saved Concert entities
     */
    public List<Concert> fetchAndSaveEventsByArtistAndLocation(String artistName, String countryCode, String city, int size) {
        try {
            int validSize = Math.max(1, size);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("apikey", apiKey)
                .queryParam("keyword", artistName)
                .queryParam("countryCode", countryCode)
                .queryParam("classificationName", "music")
                .queryParam("size", validSize);

            if (city != null && !city.isEmpty()) {
                builder.queryParam("city", city);
            }

            String url = builder.toUriString();
            log.info("Calling Ticketmaster API for artist and location with URL: {}", url);

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null) {
                log.warn("Received null response from Ticketmaster API");
                return Collections.emptyList();
            }

            if (response.containsKey("fault")) {
                log.error("Ticketmaster API error: {}", response);
                return Collections.emptyList();
            }

            return processAndSaveConcerts(response);
        } catch (Exception e) {
            log.error(
                "Error fetching events from Ticketmaster API for artist {} in location {}, {}: {}",
                artistName,
                countryCode,
                city,
                e.getMessage(),
                e
            );
            return Collections.emptyList();
        }
    }

    public void clearConcertsByCountry(String countryCode) {
        log.debug("Clearing all concerts from country: {}", countryCode);
        List<Concert> concerts = concertRepository.findByCountry(countryCode);
        concertRepository.deleteAll(concerts);
    }

    /**
     * Process Ticketmaster API response and save concerts to database
     */
    @SuppressWarnings("unchecked")
    private List<Concert> processAndSaveConcerts(Map<String, Object> response) {
        List<Concert> savedConcerts = new ArrayList<>();

        try {
            if (response == null) {
                log.warn("Null response received in processAndSaveConcerts");
                return savedConcerts;
            }

            if (!response.containsKey("_embedded")) {
                log.warn("No _embedded field found in response: {}", response.keySet());
                return savedConcerts;
            }

            Map<String, Object> embedded = (Map<String, Object>) response.get("_embedded");
            if (embedded == null || !embedded.containsKey("events")) {
                log.warn("No events field found in _embedded: {}", embedded != null ? embedded.keySet() : "embedded is null");
                return savedConcerts;
            }

            List<Map<String, Object>> events = (List<Map<String, Object>>) embedded.get("events");
            if (events == null || events.isEmpty()) {
                log.warn("Events list is empty or null");
                return savedConcerts;
            }

            log.info("Processing {} events from Ticketmaster", events.size());
            for (Map<String, Object> event : events) {
                try {
                    Concert concert = mapEventToConcert(event);
                    // Log the concert being saved
                    log.debug("Saving concert: {}", concert);
                    Concert savedConcert = concertRepository.save(concert);
                    savedConcerts.add(savedConcert);
                } catch (Exception e) {
                    log.error("Error processing event: {}", e.getMessage(), e);
                }
            }

            return savedConcerts;
        } catch (Exception e) {
            log.error("Error in processAndSaveConcerts: {}", e.getMessage(), e);
            return savedConcerts;
        }
    }

    /**
     * Map Ticketmaster API event data to Concert entity
     */
    @SuppressWarnings("unchecked")
    private Concert mapEventToConcert(Map<String, Object> event) {
        Concert concert = new Concert();

        if (event.containsKey("_embedded")) {
            Map<String, Object> embeddedEvent = (Map<String, Object>) event.get("_embedded");
            if (embeddedEvent.containsKey("attractions")) {
                List<Map<String, Object>> attractions = (List<Map<String, Object>>) embeddedEvent.get("attractions");
                if (!attractions.isEmpty()) {
                    concert.setArtistName((String) attractions.get(0).get("name"));
                }
            }
        }

        if (concert.getArtistName() == null) {
            concert.setArtistName("Unknown Artist");
        }

        String venueName = "Unknown Venue";
        String country = "";
        String region = "";

        if (event.containsKey("_embedded")) {
            Map<String, Object> embeddedEvent = (Map<String, Object>) event.get("_embedded");
            if (embeddedEvent.containsKey("venues")) {
                List<Map<String, Object>> venues = (List<Map<String, Object>>) embeddedEvent.get("venues");
                if (!venues.isEmpty()) {
                    Map<String, Object> venue = venues.get(0);
                    venueName = (String) venue.get("name");

                    if (venue.containsKey("country")) {
                        Map<String, Object> countryObj = (Map<String, Object>) venue.get("country");
                        country = (String) countryObj.get("name");
                    }

                    if (venue.containsKey("city")) {
                        Map<String, Object> cityObj = (Map<String, Object>) venue.get("city");
                        region = (String) cityObj.get("name");
                    }
                }
            }
        }

        concert.setVenueName(venueName);
        concert.setCountry(country);
        concert.setRegion(region);

        if (event.containsKey("dates")) {
            Map<String, Object> dates = (Map<String, Object>) event.get("dates");
            if (dates.containsKey("start")) {
                Map<String, Object> start = (Map<String, Object>) dates.get("start");
                if (start.containsKey("dateTime")) {
                    String dateTimeStr = (String) start.get("dateTime");
                    try {
                        ZonedDateTime dateTime = ZonedDateTime.parse(dateTimeStr);
                        concert.setEventDate(dateTime);
                    } catch (Exception e) {
                        concert.setEventDate(ZonedDateTime.now());
                    }
                }
            }
        }

        if (concert.getEventDate() == null) {
            concert.setEventDate(ZonedDateTime.now());
        }

        concert.setTicketmasterEventId((String) event.get("id"));

        concert.setExternalUrl((String) event.get("url"));

        if (event.containsKey("images")) {
            List<Map<String, Object>> images = (List<Map<String, Object>>) event.get("images");
            if (!images.isEmpty()) {
                // Try to find a medium-sized image
                Map<String, Object> selectedImage = images.get(0);
                for (Map<String, Object> image : images) {
                    Integer width = (Integer) image.get("width");
                    if (width != null && width >= 300 && width <= 500) {
                        selectedImage = image;
                        break;
                    }
                }
                concert.setImageUrl((String) selectedImage.get("url"));
            }
        }

        if (concert.getImageUrl() == null) {
            concert.setImageUrl("../../content/images/placeholder.jpg");
        }

        return concert;
    }
}
