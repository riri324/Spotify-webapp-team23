package bham.team.web.rest;

import static bham.team.domain.ArtistAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.Artist;
import bham.team.repository.ArtistRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Base64;
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
 * Integration tests for the {@link ArtistResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ArtistResourceIT {

    private static final String DEFAULT_ARTIST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ARTIST_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_FOLLOWERS = 1;
    private static final Integer UPDATED_FOLLOWERS = 2;

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/artists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restArtistMockMvc;

    private Artist artist;

    private Artist insertedArtist;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Artist createEntity() {
        return new Artist()
            .artistName(DEFAULT_ARTIST_NAME)
            .followers(DEFAULT_FOLLOWERS)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Artist createUpdatedEntity() {
        return new Artist()
            .artistName(UPDATED_ARTIST_NAME)
            .followers(UPDATED_FOLLOWERS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @BeforeEach
    public void initTest() {
        artist = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedArtist != null) {
            artistRepository.delete(insertedArtist);
            insertedArtist = null;
        }
    }

    @Test
    @Transactional
    void createArtist() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Artist
        var returnedArtist = om.readValue(
            restArtistMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artist)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Artist.class
        );

        // Validate the Artist in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertArtistUpdatableFieldsEquals(returnedArtist, getPersistedArtist(returnedArtist));

        insertedArtist = returnedArtist;
    }

    @Test
    @Transactional
    void createArtistWithExistingId() throws Exception {
        // Create the Artist with an existing ID
        artist.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restArtistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artist)))
            .andExpect(status().isBadRequest());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkArtistNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        artist.setArtistName(null);

        // Create the Artist, which fails.

        restArtistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artist)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkFollowersIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        artist.setFollowers(null);

        // Create the Artist, which fails.

        restArtistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artist)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllArtists() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        // Get all the artistList
        restArtistMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(artist.getId().intValue())))
            .andExpect(jsonPath("$.[*].artistName").value(hasItem(DEFAULT_ARTIST_NAME)))
            .andExpect(jsonPath("$.[*].followers").value(hasItem(DEFAULT_FOLLOWERS)))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64.getEncoder().encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    void getArtist() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        // Get the artist
        restArtistMockMvc
            .perform(get(ENTITY_API_URL_ID, artist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(artist.getId().intValue()))
            .andExpect(jsonPath("$.artistName").value(DEFAULT_ARTIST_NAME))
            .andExpect(jsonPath("$.followers").value(DEFAULT_FOLLOWERS))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64.getEncoder().encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    void getNonExistingArtist() throws Exception {
        // Get the artist
        restArtistMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingArtist() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the artist
        Artist updatedArtist = artistRepository.findById(artist.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedArtist are not directly saved in db
        em.detach(updatedArtist);
        updatedArtist
            .artistName(UPDATED_ARTIST_NAME)
            .followers(UPDATED_FOLLOWERS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restArtistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedArtist.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedArtist))
            )
            .andExpect(status().isOk());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedArtistToMatchAllProperties(updatedArtist);
    }

    @Test
    @Transactional
    void putNonExistingArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(put(ENTITY_API_URL_ID, artist.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artist)))
            .andExpect(status().isBadRequest());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(artist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artist)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateArtistWithPatch() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the artist using partial update
        Artist partialUpdatedArtist = new Artist();
        partialUpdatedArtist.setId(artist.getId());

        partialUpdatedArtist.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restArtistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArtist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedArtist))
            )
            .andExpect(status().isOk());

        // Validate the Artist in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertArtistUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedArtist, artist), getPersistedArtist(artist));
    }

    @Test
    @Transactional
    void fullUpdateArtistWithPatch() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the artist using partial update
        Artist partialUpdatedArtist = new Artist();
        partialUpdatedArtist.setId(artist.getId());

        partialUpdatedArtist
            .artistName(UPDATED_ARTIST_NAME)
            .followers(UPDATED_FOLLOWERS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restArtistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArtist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedArtist))
            )
            .andExpect(status().isOk());

        // Validate the Artist in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertArtistUpdatableFieldsEquals(partialUpdatedArtist, getPersistedArtist(partialUpdatedArtist));
    }

    @Test
    @Transactional
    void patchNonExistingArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, artist.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(artist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(artist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(artist)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteArtist() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the artist
        restArtistMockMvc
            .perform(delete(ENTITY_API_URL_ID, artist.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return artistRepository.count();
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

    protected Artist getPersistedArtist(Artist artist) {
        return artistRepository.findById(artist.getId()).orElseThrow();
    }

    protected void assertPersistedArtistToMatchAllProperties(Artist expectedArtist) {
        assertArtistAllPropertiesEquals(expectedArtist, getPersistedArtist(expectedArtist));
    }

    protected void assertPersistedArtistToMatchUpdatableProperties(Artist expectedArtist) {
        assertArtistAllUpdatablePropertiesEquals(expectedArtist, getPersistedArtist(expectedArtist));
    }
}
