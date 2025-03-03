package bham.team.web.rest;

import static bham.team.domain.GlobalTopsongsAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.GlobalTopsongs;
import bham.team.repository.GlobalTopsongsRepository;
import bham.team.service.dto.GlobalTopsongsDTO;
import bham.team.service.mapper.GlobalTopsongsMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link GlobalTopsongsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GlobalTopsongsResourceIT {

    private static final String DEFAULT_SONG_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_SONG_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_ARTIST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ARTIST_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_PLAY_COUNT = 0;
    private static final Integer UPDATED_PLAY_COUNT = 1;

    private static final Instant DEFAULT_MONTH_YEAR = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_MONTH_YEAR = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_YEAR = 2000;
    private static final Integer UPDATED_YEAR = 2001;

    private static final String ENTITY_API_URL = "/api/global-topsongs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GlobalTopsongsRepository globalTopsongsRepository;

    @Autowired
    private GlobalTopsongsMapper globalTopsongsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGlobalTopsongsMockMvc;

    private GlobalTopsongs globalTopsongs;

    private GlobalTopsongs insertedGlobalTopsongs;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GlobalTopsongs createEntity() {
        return new GlobalTopsongs()
            .songTitle(DEFAULT_SONG_TITLE)
            .artistName(DEFAULT_ARTIST_NAME)
            .playCount(DEFAULT_PLAY_COUNT)
            .monthYear(DEFAULT_MONTH_YEAR)
            .year(DEFAULT_YEAR);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GlobalTopsongs createUpdatedEntity() {
        return new GlobalTopsongs()
            .songTitle(UPDATED_SONG_TITLE)
            .artistName(UPDATED_ARTIST_NAME)
            .playCount(UPDATED_PLAY_COUNT)
            .monthYear(UPDATED_MONTH_YEAR)
            .year(UPDATED_YEAR);
    }

    @BeforeEach
    public void initTest() {
        globalTopsongs = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedGlobalTopsongs != null) {
            globalTopsongsRepository.delete(insertedGlobalTopsongs);
            insertedGlobalTopsongs = null;
        }
    }

    @Test
    @Transactional
    void createGlobalTopsongs() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the GlobalTopsongs
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);
        var returnedGlobalTopsongsDTO = om.readValue(
            restGlobalTopsongsMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(globalTopsongsDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            GlobalTopsongsDTO.class
        );

        // Validate the GlobalTopsongs in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedGlobalTopsongs = globalTopsongsMapper.toEntity(returnedGlobalTopsongsDTO);
        assertGlobalTopsongsUpdatableFieldsEquals(returnedGlobalTopsongs, getPersistedGlobalTopsongs(returnedGlobalTopsongs));

        insertedGlobalTopsongs = returnedGlobalTopsongs;
    }

    @Test
    @Transactional
    void createGlobalTopsongsWithExistingId() throws Exception {
        // Create the GlobalTopsongs with an existing ID
        globalTopsongs.setId(1L);
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGlobalTopsongsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(globalTopsongsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the GlobalTopsongs in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSongTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        globalTopsongs.setSongTitle(null);

        // Create the GlobalTopsongs, which fails.
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        restGlobalTopsongsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(globalTopsongsDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkArtistNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        globalTopsongs.setArtistName(null);

        // Create the GlobalTopsongs, which fails.
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        restGlobalTopsongsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(globalTopsongsDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPlayCountIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        globalTopsongs.setPlayCount(null);

        // Create the GlobalTopsongs, which fails.
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        restGlobalTopsongsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(globalTopsongsDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMonthYearIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        globalTopsongs.setMonthYear(null);

        // Create the GlobalTopsongs, which fails.
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        restGlobalTopsongsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(globalTopsongsDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkYearIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        globalTopsongs.setYear(null);

        // Create the GlobalTopsongs, which fails.
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        restGlobalTopsongsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(globalTopsongsDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGlobalTopsongs() throws Exception {
        // Initialize the database
        insertedGlobalTopsongs = globalTopsongsRepository.saveAndFlush(globalTopsongs);

        // Get all the globalTopsongsList
        restGlobalTopsongsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(globalTopsongs.getId().intValue())))
            .andExpect(jsonPath("$.[*].songTitle").value(hasItem(DEFAULT_SONG_TITLE)))
            .andExpect(jsonPath("$.[*].artistName").value(hasItem(DEFAULT_ARTIST_NAME)))
            .andExpect(jsonPath("$.[*].playCount").value(hasItem(DEFAULT_PLAY_COUNT)))
            .andExpect(jsonPath("$.[*].monthYear").value(hasItem(DEFAULT_MONTH_YEAR.toString())))
            .andExpect(jsonPath("$.[*].year").value(hasItem(DEFAULT_YEAR)));
    }

    @Test
    @Transactional
    void getGlobalTopsongs() throws Exception {
        // Initialize the database
        insertedGlobalTopsongs = globalTopsongsRepository.saveAndFlush(globalTopsongs);

        // Get the globalTopsongs
        restGlobalTopsongsMockMvc
            .perform(get(ENTITY_API_URL_ID, globalTopsongs.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(globalTopsongs.getId().intValue()))
            .andExpect(jsonPath("$.songTitle").value(DEFAULT_SONG_TITLE))
            .andExpect(jsonPath("$.artistName").value(DEFAULT_ARTIST_NAME))
            .andExpect(jsonPath("$.playCount").value(DEFAULT_PLAY_COUNT))
            .andExpect(jsonPath("$.monthYear").value(DEFAULT_MONTH_YEAR.toString()))
            .andExpect(jsonPath("$.year").value(DEFAULT_YEAR));
    }

    @Test
    @Transactional
    void getNonExistingGlobalTopsongs() throws Exception {
        // Get the globalTopsongs
        restGlobalTopsongsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGlobalTopsongs() throws Exception {
        // Initialize the database
        insertedGlobalTopsongs = globalTopsongsRepository.saveAndFlush(globalTopsongs);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the globalTopsongs
        GlobalTopsongs updatedGlobalTopsongs = globalTopsongsRepository.findById(globalTopsongs.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGlobalTopsongs are not directly saved in db
        em.detach(updatedGlobalTopsongs);
        updatedGlobalTopsongs
            .songTitle(UPDATED_SONG_TITLE)
            .artistName(UPDATED_ARTIST_NAME)
            .playCount(UPDATED_PLAY_COUNT)
            .monthYear(UPDATED_MONTH_YEAR)
            .year(UPDATED_YEAR);
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(updatedGlobalTopsongs);

        restGlobalTopsongsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, globalTopsongsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(globalTopsongsDTO))
            )
            .andExpect(status().isOk());

        // Validate the GlobalTopsongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGlobalTopsongsToMatchAllProperties(updatedGlobalTopsongs);
    }

    @Test
    @Transactional
    void putNonExistingGlobalTopsongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        globalTopsongs.setId(longCount.incrementAndGet());

        // Create the GlobalTopsongs
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGlobalTopsongsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, globalTopsongsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(globalTopsongsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalTopsongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGlobalTopsongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        globalTopsongs.setId(longCount.incrementAndGet());

        // Create the GlobalTopsongs
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalTopsongsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(globalTopsongsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalTopsongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGlobalTopsongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        globalTopsongs.setId(longCount.incrementAndGet());

        // Create the GlobalTopsongs
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalTopsongsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(globalTopsongsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GlobalTopsongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGlobalTopsongsWithPatch() throws Exception {
        // Initialize the database
        insertedGlobalTopsongs = globalTopsongsRepository.saveAndFlush(globalTopsongs);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the globalTopsongs using partial update
        GlobalTopsongs partialUpdatedGlobalTopsongs = new GlobalTopsongs();
        partialUpdatedGlobalTopsongs.setId(globalTopsongs.getId());

        partialUpdatedGlobalTopsongs
            .songTitle(UPDATED_SONG_TITLE)
            .artistName(UPDATED_ARTIST_NAME)
            .playCount(UPDATED_PLAY_COUNT)
            .monthYear(UPDATED_MONTH_YEAR);

        restGlobalTopsongsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGlobalTopsongs.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGlobalTopsongs))
            )
            .andExpect(status().isOk());

        // Validate the GlobalTopsongs in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGlobalTopsongsUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedGlobalTopsongs, globalTopsongs),
            getPersistedGlobalTopsongs(globalTopsongs)
        );
    }

    @Test
    @Transactional
    void fullUpdateGlobalTopsongsWithPatch() throws Exception {
        // Initialize the database
        insertedGlobalTopsongs = globalTopsongsRepository.saveAndFlush(globalTopsongs);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the globalTopsongs using partial update
        GlobalTopsongs partialUpdatedGlobalTopsongs = new GlobalTopsongs();
        partialUpdatedGlobalTopsongs.setId(globalTopsongs.getId());

        partialUpdatedGlobalTopsongs
            .songTitle(UPDATED_SONG_TITLE)
            .artistName(UPDATED_ARTIST_NAME)
            .playCount(UPDATED_PLAY_COUNT)
            .monthYear(UPDATED_MONTH_YEAR)
            .year(UPDATED_YEAR);

        restGlobalTopsongsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGlobalTopsongs.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGlobalTopsongs))
            )
            .andExpect(status().isOk());

        // Validate the GlobalTopsongs in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGlobalTopsongsUpdatableFieldsEquals(partialUpdatedGlobalTopsongs, getPersistedGlobalTopsongs(partialUpdatedGlobalTopsongs));
    }

    @Test
    @Transactional
    void patchNonExistingGlobalTopsongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        globalTopsongs.setId(longCount.incrementAndGet());

        // Create the GlobalTopsongs
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGlobalTopsongsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, globalTopsongsDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(globalTopsongsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalTopsongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGlobalTopsongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        globalTopsongs.setId(longCount.incrementAndGet());

        // Create the GlobalTopsongs
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalTopsongsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(globalTopsongsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalTopsongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGlobalTopsongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        globalTopsongs.setId(longCount.incrementAndGet());

        // Create the GlobalTopsongs
        GlobalTopsongsDTO globalTopsongsDTO = globalTopsongsMapper.toDto(globalTopsongs);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalTopsongsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(globalTopsongsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GlobalTopsongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGlobalTopsongs() throws Exception {
        // Initialize the database
        insertedGlobalTopsongs = globalTopsongsRepository.saveAndFlush(globalTopsongs);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the globalTopsongs
        restGlobalTopsongsMockMvc
            .perform(delete(ENTITY_API_URL_ID, globalTopsongs.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return globalTopsongsRepository.count();
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

    protected GlobalTopsongs getPersistedGlobalTopsongs(GlobalTopsongs globalTopsongs) {
        return globalTopsongsRepository.findById(globalTopsongs.getId()).orElseThrow();
    }

    protected void assertPersistedGlobalTopsongsToMatchAllProperties(GlobalTopsongs expectedGlobalTopsongs) {
        assertGlobalTopsongsAllPropertiesEquals(expectedGlobalTopsongs, getPersistedGlobalTopsongs(expectedGlobalTopsongs));
    }

    protected void assertPersistedGlobalTopsongsToMatchUpdatableProperties(GlobalTopsongs expectedGlobalTopsongs) {
        assertGlobalTopsongsAllUpdatablePropertiesEquals(expectedGlobalTopsongs, getPersistedGlobalTopsongs(expectedGlobalTopsongs));
    }
}
