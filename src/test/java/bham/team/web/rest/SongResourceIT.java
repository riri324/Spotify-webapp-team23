package bham.team.web.rest;

import static bham.team.domain.SongAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.Song;
import bham.team.repository.SongRepository;
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
 * Integration tests for the {@link SongResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SongResourceIT {

    private static final String DEFAULT_TRACK_ID = "AAAAAAAAAA";
    private static final String UPDATED_TRACK_ID = "BBBBBBBBBB";

    private static final String DEFAULT_ARTISTS = "AAAAAAAAAA";
    private static final String UPDATED_ARTISTS = "BBBBBBBBBB";

    private static final String DEFAULT_ALBUM_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ALBUM_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TRACK_NAME = "AAAAAAAAAA";
    private static final String UPDATED_TRACK_NAME = "BBBBBBBBBB";

    private static final Float DEFAULT_DANCEABILITY = 1F;
    private static final Float UPDATED_DANCEABILITY = 2F;

    private static final Float DEFAULT_ENERGY = 1F;
    private static final Float UPDATED_ENERGY = 2F;

    private static final Float DEFAULT_SPEECHINESS = 1F;
    private static final Float UPDATED_SPEECHINESS = 2F;

    private static final Float DEFAULT_ACOUSTICNESS = 1F;
    private static final Float UPDATED_ACOUSTICNESS = 2F;

    private static final Float DEFAULT_INSTRUMENTALNESS = 1F;
    private static final Float UPDATED_INSTRUMENTALNESS = 2F;

    private static final Float DEFAULT_LIVENESS = 1F;
    private static final Float UPDATED_LIVENESS = 2F;

    private static final Float DEFAULT_VALENCE = 1F;
    private static final Float UPDATED_VALENCE = 2F;

    private static final Float DEFAULT_TEMPO = 1F;
    private static final Float UPDATED_TEMPO = 2F;

    private static final String DEFAULT_TRACK_GENRE = "AAAAAAAAAA";
    private static final String UPDATED_TRACK_GENRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/songs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SongRepository songRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSongMockMvc;

    private Song song;

    private Song insertedSong;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Song createEntity() {
        return new Song()
            .trackId(DEFAULT_TRACK_ID)
            .artists(DEFAULT_ARTISTS)
            .albumName(DEFAULT_ALBUM_NAME)
            .trackName(DEFAULT_TRACK_NAME)
            .danceability(DEFAULT_DANCEABILITY)
            .energy(DEFAULT_ENERGY)
            .speechiness(DEFAULT_SPEECHINESS)
            .acousticness(DEFAULT_ACOUSTICNESS)
            .instrumentalness(DEFAULT_INSTRUMENTALNESS)
            .liveness(DEFAULT_LIVENESS)
            .valence(DEFAULT_VALENCE)
            .tempo(DEFAULT_TEMPO)
            .trackGenre(DEFAULT_TRACK_GENRE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Song createUpdatedEntity() {
        return new Song()
            .trackId(UPDATED_TRACK_ID)
            .artists(UPDATED_ARTISTS)
            .albumName(UPDATED_ALBUM_NAME)
            .trackName(UPDATED_TRACK_NAME)
            .danceability(UPDATED_DANCEABILITY)
            .energy(UPDATED_ENERGY)
            .speechiness(UPDATED_SPEECHINESS)
            .acousticness(UPDATED_ACOUSTICNESS)
            .instrumentalness(UPDATED_INSTRUMENTALNESS)
            .liveness(UPDATED_LIVENESS)
            .valence(UPDATED_VALENCE)
            .tempo(UPDATED_TEMPO)
            .trackGenre(UPDATED_TRACK_GENRE);
    }

    @BeforeEach
    public void initTest() {
        song = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedSong != null) {
            songRepository.delete(insertedSong);
            insertedSong = null;
        }
    }

    @Test
    @Transactional
    void createSong() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Song
        var returnedSong = om.readValue(
            restSongMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(song)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Song.class
        );

        // Validate the Song in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSongUpdatableFieldsEquals(returnedSong, getPersistedSong(returnedSong));

        insertedSong = returnedSong;
    }

    @Test
    @Transactional
    void createSongWithExistingId() throws Exception {
        // Create the Song with an existing ID
        song.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSongMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(song)))
            .andExpect(status().isBadRequest());

        // Validate the Song in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTrackIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        song.setTrackId(null);

        // Create the Song, which fails.

        restSongMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(song)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSongs() throws Exception {
        // Initialize the database
        insertedSong = songRepository.saveAndFlush(song);

        // Get all the songList
        restSongMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(song.getId().intValue())))
            .andExpect(jsonPath("$.[*].trackId").value(hasItem(DEFAULT_TRACK_ID)))
            .andExpect(jsonPath("$.[*].artists").value(hasItem(DEFAULT_ARTISTS)))
            .andExpect(jsonPath("$.[*].albumName").value(hasItem(DEFAULT_ALBUM_NAME)))
            .andExpect(jsonPath("$.[*].trackName").value(hasItem(DEFAULT_TRACK_NAME)))
            .andExpect(jsonPath("$.[*].danceability").value(hasItem(DEFAULT_DANCEABILITY.doubleValue())))
            .andExpect(jsonPath("$.[*].energy").value(hasItem(DEFAULT_ENERGY.doubleValue())))
            .andExpect(jsonPath("$.[*].speechiness").value(hasItem(DEFAULT_SPEECHINESS.doubleValue())))
            .andExpect(jsonPath("$.[*].acousticness").value(hasItem(DEFAULT_ACOUSTICNESS.doubleValue())))
            .andExpect(jsonPath("$.[*].instrumentalness").value(hasItem(DEFAULT_INSTRUMENTALNESS.doubleValue())))
            .andExpect(jsonPath("$.[*].liveness").value(hasItem(DEFAULT_LIVENESS.doubleValue())))
            .andExpect(jsonPath("$.[*].valence").value(hasItem(DEFAULT_VALENCE.doubleValue())))
            .andExpect(jsonPath("$.[*].tempo").value(hasItem(DEFAULT_TEMPO.doubleValue())))
            .andExpect(jsonPath("$.[*].trackGenre").value(hasItem(DEFAULT_TRACK_GENRE)));
    }

    @Test
    @Transactional
    void getSong() throws Exception {
        // Initialize the database
        insertedSong = songRepository.saveAndFlush(song);

        // Get the song
        restSongMockMvc
            .perform(get(ENTITY_API_URL_ID, song.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(song.getId().intValue()))
            .andExpect(jsonPath("$.trackId").value(DEFAULT_TRACK_ID))
            .andExpect(jsonPath("$.artists").value(DEFAULT_ARTISTS))
            .andExpect(jsonPath("$.albumName").value(DEFAULT_ALBUM_NAME))
            .andExpect(jsonPath("$.trackName").value(DEFAULT_TRACK_NAME))
            .andExpect(jsonPath("$.danceability").value(DEFAULT_DANCEABILITY.doubleValue()))
            .andExpect(jsonPath("$.energy").value(DEFAULT_ENERGY.doubleValue()))
            .andExpect(jsonPath("$.speechiness").value(DEFAULT_SPEECHINESS.doubleValue()))
            .andExpect(jsonPath("$.acousticness").value(DEFAULT_ACOUSTICNESS.doubleValue()))
            .andExpect(jsonPath("$.instrumentalness").value(DEFAULT_INSTRUMENTALNESS.doubleValue()))
            .andExpect(jsonPath("$.liveness").value(DEFAULT_LIVENESS.doubleValue()))
            .andExpect(jsonPath("$.valence").value(DEFAULT_VALENCE.doubleValue()))
            .andExpect(jsonPath("$.tempo").value(DEFAULT_TEMPO.doubleValue()))
            .andExpect(jsonPath("$.trackGenre").value(DEFAULT_TRACK_GENRE));
    }

    @Test
    @Transactional
    void getNonExistingSong() throws Exception {
        // Get the song
        restSongMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSong() throws Exception {
        // Initialize the database
        insertedSong = songRepository.saveAndFlush(song);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the song
        Song updatedSong = songRepository.findById(song.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSong are not directly saved in db
        em.detach(updatedSong);
        updatedSong
            .trackId(UPDATED_TRACK_ID)
            .artists(UPDATED_ARTISTS)
            .albumName(UPDATED_ALBUM_NAME)
            .trackName(UPDATED_TRACK_NAME)
            .danceability(UPDATED_DANCEABILITY)
            .energy(UPDATED_ENERGY)
            .speechiness(UPDATED_SPEECHINESS)
            .acousticness(UPDATED_ACOUSTICNESS)
            .instrumentalness(UPDATED_INSTRUMENTALNESS)
            .liveness(UPDATED_LIVENESS)
            .valence(UPDATED_VALENCE)
            .tempo(UPDATED_TEMPO)
            .trackGenre(UPDATED_TRACK_GENRE);

        restSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSong.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSong))
            )
            .andExpect(status().isOk());

        // Validate the Song in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSongToMatchAllProperties(updatedSong);
    }

    @Test
    @Transactional
    void putNonExistingSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        song.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSongMockMvc
            .perform(put(ENTITY_API_URL_ID, song.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(song)))
            .andExpect(status().isBadRequest());

        // Validate the Song in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        song.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(song))
            )
            .andExpect(status().isBadRequest());

        // Validate the Song in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        song.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSongMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(song)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Song in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSongWithPatch() throws Exception {
        // Initialize the database
        insertedSong = songRepository.saveAndFlush(song);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the song using partial update
        Song partialUpdatedSong = new Song();
        partialUpdatedSong.setId(song.getId());

        partialUpdatedSong
            .artists(UPDATED_ARTISTS)
            .albumName(UPDATED_ALBUM_NAME)
            .trackName(UPDATED_TRACK_NAME)
            .energy(UPDATED_ENERGY)
            .speechiness(UPDATED_SPEECHINESS)
            .acousticness(UPDATED_ACOUSTICNESS)
            .instrumentalness(UPDATED_INSTRUMENTALNESS)
            .tempo(UPDATED_TEMPO);

        restSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSong.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSong))
            )
            .andExpect(status().isOk());

        // Validate the Song in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSongUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedSong, song), getPersistedSong(song));
    }

    @Test
    @Transactional
    void fullUpdateSongWithPatch() throws Exception {
        // Initialize the database
        insertedSong = songRepository.saveAndFlush(song);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the song using partial update
        Song partialUpdatedSong = new Song();
        partialUpdatedSong.setId(song.getId());

        partialUpdatedSong
            .trackId(UPDATED_TRACK_ID)
            .artists(UPDATED_ARTISTS)
            .albumName(UPDATED_ALBUM_NAME)
            .trackName(UPDATED_TRACK_NAME)
            .danceability(UPDATED_DANCEABILITY)
            .energy(UPDATED_ENERGY)
            .speechiness(UPDATED_SPEECHINESS)
            .acousticness(UPDATED_ACOUSTICNESS)
            .instrumentalness(UPDATED_INSTRUMENTALNESS)
            .liveness(UPDATED_LIVENESS)
            .valence(UPDATED_VALENCE)
            .tempo(UPDATED_TEMPO)
            .trackGenre(UPDATED_TRACK_GENRE);

        restSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSong.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSong))
            )
            .andExpect(status().isOk());

        // Validate the Song in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSongUpdatableFieldsEquals(partialUpdatedSong, getPersistedSong(partialUpdatedSong));
    }

    @Test
    @Transactional
    void patchNonExistingSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        song.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSongMockMvc
            .perform(patch(ENTITY_API_URL_ID, song.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(song)))
            .andExpect(status().isBadRequest());

        // Validate the Song in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        song.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(song))
            )
            .andExpect(status().isBadRequest());

        // Validate the Song in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        song.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSongMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(song)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Song in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSong() throws Exception {
        // Initialize the database
        insertedSong = songRepository.saveAndFlush(song);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the song
        restSongMockMvc
            .perform(delete(ENTITY_API_URL_ID, song.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return songRepository.count();
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

    protected Song getPersistedSong(Song song) {
        return songRepository.findById(song.getId()).orElseThrow();
    }

    protected void assertPersistedSongToMatchAllProperties(Song expectedSong) {
        assertSongAllPropertiesEquals(expectedSong, getPersistedSong(expectedSong));
    }

    protected void assertPersistedSongToMatchUpdatableProperties(Song expectedSong) {
        assertSongAllUpdatablePropertiesEquals(expectedSong, getPersistedSong(expectedSong));
    }
}
