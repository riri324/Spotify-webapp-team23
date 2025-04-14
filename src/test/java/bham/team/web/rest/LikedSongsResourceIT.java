package bham.team.web.rest;

import static bham.team.domain.LikedSongsAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.LikedSongs;
import bham.team.repository.LikedSongsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link LikedSongsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LikedSongsResourceIT {

    private static final Integer DEFAULT_LIKE_ID = 1;
    private static final Integer UPDATED_LIKE_ID = 2;

    private static final String ENTITY_API_URL = "/api/liked-songs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LikedSongsRepository likedSongsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLikedSongsMockMvc;

    private LikedSongs likedSongs;

    private LikedSongs insertedLikedSongs;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LikedSongs createEntity() {
        return new LikedSongs().likeID(DEFAULT_LIKE_ID);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LikedSongs createUpdatedEntity() {
        return new LikedSongs().likeID(UPDATED_LIKE_ID);
    }

    @BeforeEach
    public void initTest() {
        likedSongs = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedLikedSongs != null) {
            likedSongsRepository.delete(insertedLikedSongs);
            insertedLikedSongs = null;
        }
    }

    @Test
    @Transactional
    void createLikedSongs() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the LikedSongs
        var returnedLikedSongs = om.readValue(
            restLikedSongsMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(likedSongs)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            LikedSongs.class
        );

        // Validate the LikedSongs in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertLikedSongsUpdatableFieldsEquals(returnedLikedSongs, getPersistedLikedSongs(returnedLikedSongs));

        insertedLikedSongs = returnedLikedSongs;
    }

    @Test
    @Transactional
    void createLikedSongsWithExistingId() throws Exception {
        // Create the LikedSongs with an existing ID
        likedSongs.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLikedSongsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(likedSongs)))
            .andExpect(status().isBadRequest());

        // Validate the LikedSongs in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLikeIDIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        likedSongs.setLikeID(null);

        // Create the LikedSongs, which fails.

        restLikedSongsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(likedSongs)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLikedSongs() throws Exception {
        // Initialize the database
        insertedLikedSongs = likedSongsRepository.saveAndFlush(likedSongs);

        // Get all the likedSongsList
        restLikedSongsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(likedSongs.getId().intValue())))
            .andExpect(jsonPath("$.[*].likeID").value(hasItem(DEFAULT_LIKE_ID)));
    }

    @Test
    @Transactional
    void getLikedSongs() throws Exception {
        // Initialize the database
        insertedLikedSongs = likedSongsRepository.saveAndFlush(likedSongs);

        // Get the likedSongs
        restLikedSongsMockMvc
            .perform(get(ENTITY_API_URL_ID, likedSongs.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(likedSongs.getId().intValue()))
            .andExpect(jsonPath("$.likeID").value(DEFAULT_LIKE_ID));
    }

    @Test
    @Transactional
    void getNonExistingLikedSongs() throws Exception {
        // Get the likedSongs
        restLikedSongsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLikedSongs() throws Exception {
        // Initialize the database
        insertedLikedSongs = likedSongsRepository.saveAndFlush(likedSongs);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the likedSongs
        LikedSongs updatedLikedSongs = likedSongsRepository.findById(likedSongs.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLikedSongs are not directly saved in db
        em.detach(updatedLikedSongs);
        updatedLikedSongs.likeID(UPDATED_LIKE_ID);

        restLikedSongsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLikedSongs.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedLikedSongs))
            )
            .andExpect(status().isOk());

        // Validate the LikedSongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLikedSongsToMatchAllProperties(updatedLikedSongs);
    }

    @Test
    @Transactional
    void putNonExistingLikedSongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        likedSongs.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLikedSongsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, likedSongs.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(likedSongs))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedSongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLikedSongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        likedSongs.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedSongsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(likedSongs))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedSongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLikedSongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        likedSongs.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedSongsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(likedSongs)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LikedSongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLikedSongsWithPatch() throws Exception {
        // Initialize the database
        insertedLikedSongs = likedSongsRepository.saveAndFlush(likedSongs);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the likedSongs using partial update
        LikedSongs partialUpdatedLikedSongs = new LikedSongs();
        partialUpdatedLikedSongs.setId(likedSongs.getId());

        partialUpdatedLikedSongs.likeID(UPDATED_LIKE_ID);

        restLikedSongsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLikedSongs.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLikedSongs))
            )
            .andExpect(status().isOk());

        // Validate the LikedSongs in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLikedSongsUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedLikedSongs, likedSongs),
            getPersistedLikedSongs(likedSongs)
        );
    }

    @Test
    @Transactional
    void fullUpdateLikedSongsWithPatch() throws Exception {
        // Initialize the database
        insertedLikedSongs = likedSongsRepository.saveAndFlush(likedSongs);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the likedSongs using partial update
        LikedSongs partialUpdatedLikedSongs = new LikedSongs();
        partialUpdatedLikedSongs.setId(likedSongs.getId());

        partialUpdatedLikedSongs.likeID(UPDATED_LIKE_ID);

        restLikedSongsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLikedSongs.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLikedSongs))
            )
            .andExpect(status().isOk());

        // Validate the LikedSongs in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLikedSongsUpdatableFieldsEquals(partialUpdatedLikedSongs, getPersistedLikedSongs(partialUpdatedLikedSongs));
    }

    @Test
    @Transactional
    void patchNonExistingLikedSongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        likedSongs.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLikedSongsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, likedSongs.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(likedSongs))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedSongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLikedSongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        likedSongs.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedSongsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(likedSongs))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedSongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLikedSongs() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        likedSongs.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedSongsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(likedSongs)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LikedSongs in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLikedSongs() throws Exception {
        // Initialize the database
        insertedLikedSongs = likedSongsRepository.saveAndFlush(likedSongs);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the likedSongs
        restLikedSongsMockMvc
            .perform(delete(ENTITY_API_URL_ID, likedSongs.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return likedSongsRepository.count();
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

    protected LikedSongs getPersistedLikedSongs(LikedSongs likedSongs) {
        return likedSongsRepository.findById(likedSongs.getId()).orElseThrow();
    }

    protected void assertPersistedLikedSongsToMatchAllProperties(LikedSongs expectedLikedSongs) {
        assertLikedSongsAllPropertiesEquals(expectedLikedSongs, getPersistedLikedSongs(expectedLikedSongs));
    }

    protected void assertPersistedLikedSongsToMatchUpdatableProperties(LikedSongs expectedLikedSongs) {
        assertLikedSongsAllUpdatablePropertiesEquals(expectedLikedSongs, getPersistedLikedSongs(expectedLikedSongs));
    }
}
