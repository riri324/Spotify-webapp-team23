package bham.team.web.rest;

import static bham.team.domain.ConcertAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static bham.team.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.Concert;
import bham.team.repository.ConcertRepository;
import bham.team.service.dto.ConcertDTO;
import bham.team.service.mapper.ConcertMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ConcertResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConcertResourceIT {

    private static final String DEFAULT_ARTIST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ARTIST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_VENUE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_VENUE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COUNTRY = "AAAAAAAAAA";
    private static final String UPDATED_COUNTRY = "BBBBBBBBBB";

    private static final String DEFAULT_REGION = "AAAAAAAAAA";
    private static final String UPDATED_REGION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_EVENT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EVENT_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_EVENT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final String DEFAULT_TICKETMASTER_EVENT_ID = "AAAAAAAAAA";
    private static final String UPDATED_TICKETMASTER_EVENT_ID = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE_URL = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_URL = "BBBBBBBBBB";

    private static final String DEFAULT_EXTERNAL_URL = "AAAAAAAAAA";
    private static final String UPDATED_EXTERNAL_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/concerts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ConcertRepository concertRepository;

    @Autowired
    private ConcertMapper concertMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConcertMockMvc;

    private Concert concert;

    private Concert insertedConcert;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Concert createEntity() {
        return new Concert()
            .artistName(DEFAULT_ARTIST_NAME)
            .venueName(DEFAULT_VENUE_NAME)
            .country(DEFAULT_COUNTRY)
            .region(DEFAULT_REGION)
            .eventDate(DEFAULT_EVENT_DATE)
            .ticketmasterEventId(DEFAULT_TICKETMASTER_EVENT_ID)
            .imageUrl(DEFAULT_IMAGE_URL)
            .externalUrl(DEFAULT_EXTERNAL_URL);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Concert createUpdatedEntity() {
        return new Concert()
            .artistName(UPDATED_ARTIST_NAME)
            .venueName(UPDATED_VENUE_NAME)
            .country(UPDATED_COUNTRY)
            .region(UPDATED_REGION)
            .eventDate(UPDATED_EVENT_DATE)
            .ticketmasterEventId(UPDATED_TICKETMASTER_EVENT_ID)
            .imageUrl(UPDATED_IMAGE_URL)
            .externalUrl(UPDATED_EXTERNAL_URL);
    }

    @BeforeEach
    public void initTest() {
        concert = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedConcert != null) {
            concertRepository.delete(insertedConcert);
            insertedConcert = null;
        }
    }

    @Test
    @Transactional
    void createConcert() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Concert
        ConcertDTO concertDTO = concertMapper.toDto(concert);
        var returnedConcertDTO = om.readValue(
            restConcertMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(concertDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ConcertDTO.class
        );

        // Validate the Concert in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedConcert = concertMapper.toEntity(returnedConcertDTO);
        assertConcertUpdatableFieldsEquals(returnedConcert, getPersistedConcert(returnedConcert));

        insertedConcert = returnedConcert;
    }

    @Test
    @Transactional
    void createConcertWithExistingId() throws Exception {
        // Create the Concert with an existing ID
        concert.setId(1L);
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConcertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(concertDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Concert in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkArtistNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        concert.setArtistName(null);

        // Create the Concert, which fails.
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        restConcertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(concertDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVenueNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        concert.setVenueName(null);

        // Create the Concert, which fails.
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        restConcertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(concertDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCountryIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        concert.setCountry(null);

        // Create the Concert, which fails.
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        restConcertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(concertDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEventDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        concert.setEventDate(null);

        // Create the Concert, which fails.
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        restConcertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(concertDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllConcerts() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList
        restConcertMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(concert.getId().intValue())))
            .andExpect(jsonPath("$.[*].artistName").value(hasItem(DEFAULT_ARTIST_NAME)))
            .andExpect(jsonPath("$.[*].venueName").value(hasItem(DEFAULT_VENUE_NAME)))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY)))
            .andExpect(jsonPath("$.[*].region").value(hasItem(DEFAULT_REGION)))
            .andExpect(jsonPath("$.[*].eventDate").value(hasItem(sameInstant(DEFAULT_EVENT_DATE))))
            .andExpect(jsonPath("$.[*].ticketmasterEventId").value(hasItem(DEFAULT_TICKETMASTER_EVENT_ID)))
            .andExpect(jsonPath("$.[*].imageUrl").value(hasItem(DEFAULT_IMAGE_URL)))
            .andExpect(jsonPath("$.[*].externalUrl").value(hasItem(DEFAULT_EXTERNAL_URL)));
    }

    @Test
    @Transactional
    void getConcert() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get the concert
        restConcertMockMvc
            .perform(get(ENTITY_API_URL_ID, concert.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(concert.getId().intValue()))
            .andExpect(jsonPath("$.artistName").value(DEFAULT_ARTIST_NAME))
            .andExpect(jsonPath("$.venueName").value(DEFAULT_VENUE_NAME))
            .andExpect(jsonPath("$.country").value(DEFAULT_COUNTRY))
            .andExpect(jsonPath("$.region").value(DEFAULT_REGION))
            .andExpect(jsonPath("$.eventDate").value(sameInstant(DEFAULT_EVENT_DATE)))
            .andExpect(jsonPath("$.ticketmasterEventId").value(DEFAULT_TICKETMASTER_EVENT_ID))
            .andExpect(jsonPath("$.imageUrl").value(DEFAULT_IMAGE_URL))
            .andExpect(jsonPath("$.externalUrl").value(DEFAULT_EXTERNAL_URL));
    }

    @Test
    @Transactional
    void getConcertsByIdFiltering() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        Long id = concert.getId();

        defaultConcertFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultConcertFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultConcertFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllConcertsByArtistNameIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where artistName equals to
        defaultConcertFiltering("artistName.equals=" + DEFAULT_ARTIST_NAME, "artistName.equals=" + UPDATED_ARTIST_NAME);
    }

    @Test
    @Transactional
    void getAllConcertsByArtistNameIsInShouldWork() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where artistName in
        defaultConcertFiltering("artistName.in=" + DEFAULT_ARTIST_NAME + "," + UPDATED_ARTIST_NAME, "artistName.in=" + UPDATED_ARTIST_NAME);
    }

    @Test
    @Transactional
    void getAllConcertsByArtistNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where artistName is not null
        defaultConcertFiltering("artistName.specified=true", "artistName.specified=false");
    }

    @Test
    @Transactional
    void getAllConcertsByArtistNameContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where artistName contains
        defaultConcertFiltering("artistName.contains=" + DEFAULT_ARTIST_NAME, "artistName.contains=" + UPDATED_ARTIST_NAME);
    }

    @Test
    @Transactional
    void getAllConcertsByArtistNameNotContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where artistName does not contain
        defaultConcertFiltering("artistName.doesNotContain=" + UPDATED_ARTIST_NAME, "artistName.doesNotContain=" + DEFAULT_ARTIST_NAME);
    }

    @Test
    @Transactional
    void getAllConcertsByVenueNameIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where venueName equals to
        defaultConcertFiltering("venueName.equals=" + DEFAULT_VENUE_NAME, "venueName.equals=" + UPDATED_VENUE_NAME);
    }

    @Test
    @Transactional
    void getAllConcertsByVenueNameIsInShouldWork() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where venueName in
        defaultConcertFiltering("venueName.in=" + DEFAULT_VENUE_NAME + "," + UPDATED_VENUE_NAME, "venueName.in=" + UPDATED_VENUE_NAME);
    }

    @Test
    @Transactional
    void getAllConcertsByVenueNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where venueName is not null
        defaultConcertFiltering("venueName.specified=true", "venueName.specified=false");
    }

    @Test
    @Transactional
    void getAllConcertsByVenueNameContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where venueName contains
        defaultConcertFiltering("venueName.contains=" + DEFAULT_VENUE_NAME, "venueName.contains=" + UPDATED_VENUE_NAME);
    }

    @Test
    @Transactional
    void getAllConcertsByVenueNameNotContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where venueName does not contain
        defaultConcertFiltering("venueName.doesNotContain=" + UPDATED_VENUE_NAME, "venueName.doesNotContain=" + DEFAULT_VENUE_NAME);
    }

    @Test
    @Transactional
    void getAllConcertsByCountryIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where country equals to
        defaultConcertFiltering("country.equals=" + DEFAULT_COUNTRY, "country.equals=" + UPDATED_COUNTRY);
    }

    @Test
    @Transactional
    void getAllConcertsByCountryIsInShouldWork() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where country in
        defaultConcertFiltering("country.in=" + DEFAULT_COUNTRY + "," + UPDATED_COUNTRY, "country.in=" + UPDATED_COUNTRY);
    }

    @Test
    @Transactional
    void getAllConcertsByCountryIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where country is not null
        defaultConcertFiltering("country.specified=true", "country.specified=false");
    }

    @Test
    @Transactional
    void getAllConcertsByCountryContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where country contains
        defaultConcertFiltering("country.contains=" + DEFAULT_COUNTRY, "country.contains=" + UPDATED_COUNTRY);
    }

    @Test
    @Transactional
    void getAllConcertsByCountryNotContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where country does not contain
        defaultConcertFiltering("country.doesNotContain=" + UPDATED_COUNTRY, "country.doesNotContain=" + DEFAULT_COUNTRY);
    }

    @Test
    @Transactional
    void getAllConcertsByRegionIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where region equals to
        defaultConcertFiltering("region.equals=" + DEFAULT_REGION, "region.equals=" + UPDATED_REGION);
    }

    @Test
    @Transactional
    void getAllConcertsByRegionIsInShouldWork() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where region in
        defaultConcertFiltering("region.in=" + DEFAULT_REGION + "," + UPDATED_REGION, "region.in=" + UPDATED_REGION);
    }

    @Test
    @Transactional
    void getAllConcertsByRegionIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where region is not null
        defaultConcertFiltering("region.specified=true", "region.specified=false");
    }

    @Test
    @Transactional
    void getAllConcertsByRegionContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where region contains
        defaultConcertFiltering("region.contains=" + DEFAULT_REGION, "region.contains=" + UPDATED_REGION);
    }

    @Test
    @Transactional
    void getAllConcertsByRegionNotContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where region does not contain
        defaultConcertFiltering("region.doesNotContain=" + UPDATED_REGION, "region.doesNotContain=" + DEFAULT_REGION);
    }

    @Test
    @Transactional
    void getAllConcertsByEventDateIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where eventDate equals to
        defaultConcertFiltering("eventDate.equals=" + DEFAULT_EVENT_DATE, "eventDate.equals=" + UPDATED_EVENT_DATE);
    }

    @Test
    @Transactional
    void getAllConcertsByEventDateIsInShouldWork() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where eventDate in
        defaultConcertFiltering("eventDate.in=" + DEFAULT_EVENT_DATE + "," + UPDATED_EVENT_DATE, "eventDate.in=" + UPDATED_EVENT_DATE);
    }

    @Test
    @Transactional
    void getAllConcertsByEventDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where eventDate is not null
        defaultConcertFiltering("eventDate.specified=true", "eventDate.specified=false");
    }

    @Test
    @Transactional
    void getAllConcertsByEventDateIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where eventDate is greater than or equal to
        defaultConcertFiltering("eventDate.greaterThanOrEqual=" + DEFAULT_EVENT_DATE, "eventDate.greaterThanOrEqual=" + UPDATED_EVENT_DATE);
    }

    @Test
    @Transactional
    void getAllConcertsByEventDateIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where eventDate is less than or equal to
        defaultConcertFiltering("eventDate.lessThanOrEqual=" + DEFAULT_EVENT_DATE, "eventDate.lessThanOrEqual=" + SMALLER_EVENT_DATE);
    }

    @Test
    @Transactional
    void getAllConcertsByEventDateIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where eventDate is less than
        defaultConcertFiltering("eventDate.lessThan=" + UPDATED_EVENT_DATE, "eventDate.lessThan=" + DEFAULT_EVENT_DATE);
    }

    @Test
    @Transactional
    void getAllConcertsByEventDateIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where eventDate is greater than
        defaultConcertFiltering("eventDate.greaterThan=" + SMALLER_EVENT_DATE, "eventDate.greaterThan=" + DEFAULT_EVENT_DATE);
    }

    @Test
    @Transactional
    void getAllConcertsByTicketmasterEventIdIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where ticketmasterEventId equals to
        defaultConcertFiltering(
            "ticketmasterEventId.equals=" + DEFAULT_TICKETMASTER_EVENT_ID,
            "ticketmasterEventId.equals=" + UPDATED_TICKETMASTER_EVENT_ID
        );
    }

    @Test
    @Transactional
    void getAllConcertsByTicketmasterEventIdIsInShouldWork() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where ticketmasterEventId in
        defaultConcertFiltering(
            "ticketmasterEventId.in=" + DEFAULT_TICKETMASTER_EVENT_ID + "," + UPDATED_TICKETMASTER_EVENT_ID,
            "ticketmasterEventId.in=" + UPDATED_TICKETMASTER_EVENT_ID
        );
    }

    @Test
    @Transactional
    void getAllConcertsByTicketmasterEventIdIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where ticketmasterEventId is not null
        defaultConcertFiltering("ticketmasterEventId.specified=true", "ticketmasterEventId.specified=false");
    }

    @Test
    @Transactional
    void getAllConcertsByTicketmasterEventIdContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where ticketmasterEventId contains
        defaultConcertFiltering(
            "ticketmasterEventId.contains=" + DEFAULT_TICKETMASTER_EVENT_ID,
            "ticketmasterEventId.contains=" + UPDATED_TICKETMASTER_EVENT_ID
        );
    }

    @Test
    @Transactional
    void getAllConcertsByTicketmasterEventIdNotContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where ticketmasterEventId does not contain
        defaultConcertFiltering(
            "ticketmasterEventId.doesNotContain=" + UPDATED_TICKETMASTER_EVENT_ID,
            "ticketmasterEventId.doesNotContain=" + DEFAULT_TICKETMASTER_EVENT_ID
        );
    }

    @Test
    @Transactional
    void getAllConcertsByImageUrlIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where imageUrl equals to
        defaultConcertFiltering("imageUrl.equals=" + DEFAULT_IMAGE_URL, "imageUrl.equals=" + UPDATED_IMAGE_URL);
    }

    @Test
    @Transactional
    void getAllConcertsByImageUrlIsInShouldWork() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where imageUrl in
        defaultConcertFiltering("imageUrl.in=" + DEFAULT_IMAGE_URL + "," + UPDATED_IMAGE_URL, "imageUrl.in=" + UPDATED_IMAGE_URL);
    }

    @Test
    @Transactional
    void getAllConcertsByImageUrlIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where imageUrl is not null
        defaultConcertFiltering("imageUrl.specified=true", "imageUrl.specified=false");
    }

    @Test
    @Transactional
    void getAllConcertsByImageUrlContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where imageUrl contains
        defaultConcertFiltering("imageUrl.contains=" + DEFAULT_IMAGE_URL, "imageUrl.contains=" + UPDATED_IMAGE_URL);
    }

    @Test
    @Transactional
    void getAllConcertsByImageUrlNotContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where imageUrl does not contain
        defaultConcertFiltering("imageUrl.doesNotContain=" + UPDATED_IMAGE_URL, "imageUrl.doesNotContain=" + DEFAULT_IMAGE_URL);
    }

    @Test
    @Transactional
    void getAllConcertsByExternalUrlIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where externalUrl equals to
        defaultConcertFiltering("externalUrl.equals=" + DEFAULT_EXTERNAL_URL, "externalUrl.equals=" + UPDATED_EXTERNAL_URL);
    }

    @Test
    @Transactional
    void getAllConcertsByExternalUrlIsInShouldWork() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where externalUrl in
        defaultConcertFiltering(
            "externalUrl.in=" + DEFAULT_EXTERNAL_URL + "," + UPDATED_EXTERNAL_URL,
            "externalUrl.in=" + UPDATED_EXTERNAL_URL
        );
    }

    @Test
    @Transactional
    void getAllConcertsByExternalUrlIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where externalUrl is not null
        defaultConcertFiltering("externalUrl.specified=true", "externalUrl.specified=false");
    }

    @Test
    @Transactional
    void getAllConcertsByExternalUrlContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where externalUrl contains
        defaultConcertFiltering("externalUrl.contains=" + DEFAULT_EXTERNAL_URL, "externalUrl.contains=" + UPDATED_EXTERNAL_URL);
    }

    @Test
    @Transactional
    void getAllConcertsByExternalUrlNotContainsSomething() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        // Get all the concertList where externalUrl does not contain
        defaultConcertFiltering("externalUrl.doesNotContain=" + UPDATED_EXTERNAL_URL, "externalUrl.doesNotContain=" + DEFAULT_EXTERNAL_URL);
    }

    private void defaultConcertFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultConcertShouldBeFound(shouldBeFound);
        defaultConcertShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultConcertShouldBeFound(String filter) throws Exception {
        restConcertMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(concert.getId().intValue())))
            .andExpect(jsonPath("$.[*].artistName").value(hasItem(DEFAULT_ARTIST_NAME)))
            .andExpect(jsonPath("$.[*].venueName").value(hasItem(DEFAULT_VENUE_NAME)))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY)))
            .andExpect(jsonPath("$.[*].region").value(hasItem(DEFAULT_REGION)))
            .andExpect(jsonPath("$.[*].eventDate").value(hasItem(sameInstant(DEFAULT_EVENT_DATE))))
            .andExpect(jsonPath("$.[*].ticketmasterEventId").value(hasItem(DEFAULT_TICKETMASTER_EVENT_ID)))
            .andExpect(jsonPath("$.[*].imageUrl").value(hasItem(DEFAULT_IMAGE_URL)))
            .andExpect(jsonPath("$.[*].externalUrl").value(hasItem(DEFAULT_EXTERNAL_URL)));

        // Check, that the count call also returns 1
        restConcertMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultConcertShouldNotBeFound(String filter) throws Exception {
        restConcertMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restConcertMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingConcert() throws Exception {
        // Get the concert
        restConcertMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingConcert() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the concert
        Concert updatedConcert = concertRepository.findById(concert.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedConcert are not directly saved in db
        em.detach(updatedConcert);
        updatedConcert
            .artistName(UPDATED_ARTIST_NAME)
            .venueName(UPDATED_VENUE_NAME)
            .country(UPDATED_COUNTRY)
            .region(UPDATED_REGION)
            .eventDate(UPDATED_EVENT_DATE)
            .ticketmasterEventId(UPDATED_TICKETMASTER_EVENT_ID)
            .imageUrl(UPDATED_IMAGE_URL)
            .externalUrl(UPDATED_EXTERNAL_URL);
        ConcertDTO concertDTO = concertMapper.toDto(updatedConcert);

        restConcertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, concertDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(concertDTO))
            )
            .andExpect(status().isOk());

        // Validate the Concert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedConcertToMatchAllProperties(updatedConcert);
    }

    @Test
    @Transactional
    void putNonExistingConcert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        concert.setId(longCount.incrementAndGet());

        // Create the Concert
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConcertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, concertDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(concertDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConcert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        concert.setId(longCount.incrementAndGet());

        // Create the Concert
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(concertDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConcert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        concert.setId(longCount.incrementAndGet());

        // Create the Concert
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(concertDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Concert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConcertWithPatch() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the concert using partial update
        Concert partialUpdatedConcert = new Concert();
        partialUpdatedConcert.setId(concert.getId());

        partialUpdatedConcert.country(UPDATED_COUNTRY).eventDate(UPDATED_EVENT_DATE).ticketmasterEventId(UPDATED_TICKETMASTER_EVENT_ID);

        restConcertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConcert.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedConcert))
            )
            .andExpect(status().isOk());

        // Validate the Concert in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertConcertUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedConcert, concert), getPersistedConcert(concert));
    }

    @Test
    @Transactional
    void fullUpdateConcertWithPatch() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the concert using partial update
        Concert partialUpdatedConcert = new Concert();
        partialUpdatedConcert.setId(concert.getId());

        partialUpdatedConcert
            .artistName(UPDATED_ARTIST_NAME)
            .venueName(UPDATED_VENUE_NAME)
            .country(UPDATED_COUNTRY)
            .region(UPDATED_REGION)
            .eventDate(UPDATED_EVENT_DATE)
            .ticketmasterEventId(UPDATED_TICKETMASTER_EVENT_ID)
            .imageUrl(UPDATED_IMAGE_URL)
            .externalUrl(UPDATED_EXTERNAL_URL);

        restConcertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConcert.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedConcert))
            )
            .andExpect(status().isOk());

        // Validate the Concert in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertConcertUpdatableFieldsEquals(partialUpdatedConcert, getPersistedConcert(partialUpdatedConcert));
    }

    @Test
    @Transactional
    void patchNonExistingConcert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        concert.setId(longCount.incrementAndGet());

        // Create the Concert
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConcertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, concertDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(concertDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConcert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        concert.setId(longCount.incrementAndGet());

        // Create the Concert
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(concertDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConcert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        concert.setId(longCount.incrementAndGet());

        // Create the Concert
        ConcertDTO concertDTO = concertMapper.toDto(concert);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(concertDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Concert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConcert() throws Exception {
        // Initialize the database
        insertedConcert = concertRepository.saveAndFlush(concert);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the concert
        restConcertMockMvc
            .perform(delete(ENTITY_API_URL_ID, concert.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return concertRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Concert getPersistedConcert(Concert concert) {
        return concertRepository.findById(concert.getId()).orElseThrow();
    }

    protected void assertPersistedConcertToMatchAllProperties(Concert expectedConcert) {
        assertConcertAllPropertiesEquals(expectedConcert, getPersistedConcert(expectedConcert));
    }

    protected void assertPersistedConcertToMatchUpdatableProperties(Concert expectedConcert) {
        assertConcertAllUpdatablePropertiesEquals(expectedConcert, getPersistedConcert(expectedConcert));
    }
}
