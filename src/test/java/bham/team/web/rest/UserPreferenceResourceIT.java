package bham.team.web.rest;

import static bham.team.domain.UserPreferenceAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.UserPreference;
import bham.team.repository.UserPreferenceRepository;
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
 * Integration tests for the {@link UserPreferenceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserPreferenceResourceIT {

    private static final String DEFAULT_FAVORITE_GENRE = "AAAAAAAAAA";
    private static final String UPDATED_FAVORITE_GENRE = "BBBBBBBBBB";

    private static final String DEFAULT_MUSIC_PURPOSE = "AAAAAAAAAA";
    private static final String UPDATED_MUSIC_PURPOSE = "BBBBBBBBBB";

    private static final String DEFAULT_MUSIC_MOOD = "AAAAAAAAAA";
    private static final String UPDATED_MUSIC_MOOD = "BBBBBBBBBB";

    private static final String DEFAULT_VOCAL_PREFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_VOCAL_PREFERENCE = "BBBBBBBBBB";

    private static final String DEFAULT_LISTENING_TIME = "AAAAAAAAAA";
    private static final String UPDATED_LISTENING_TIME = "BBBBBBBBBB";

    private static final String DEFAULT_LISTENING_PATTERN = "AAAAAAAAAA";
    private static final String UPDATED_LISTENING_PATTERN = "BBBBBBBBBB";

    private static final String DEFAULT_SONG_LENGTH = "AAAAAAAAAA";
    private static final String UPDATED_SONG_LENGTH = "BBBBBBBBBB";

    private static final String DEFAULT_LYRICS_IMPORTANCE = "AAAAAAAAAA";
    private static final String UPDATED_LYRICS_IMPORTANCE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-preferences";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private UserPreferenceRepository userPreferenceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserPreferenceMockMvc;

    private UserPreference userPreference;

    private UserPreference insertedUserPreference;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPreference createEntity() {
        return new UserPreference()
            .favoriteGenre(DEFAULT_FAVORITE_GENRE)
            .musicPurpose(DEFAULT_MUSIC_PURPOSE)
            .musicMood(DEFAULT_MUSIC_MOOD)
            .vocalPreference(DEFAULT_VOCAL_PREFERENCE)
            .listeningTime(DEFAULT_LISTENING_TIME)
            .listeningPattern(DEFAULT_LISTENING_PATTERN)
            .songLength(DEFAULT_SONG_LENGTH)
            .lyricsImportance(DEFAULT_LYRICS_IMPORTANCE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPreference createUpdatedEntity() {
        return new UserPreference()
            .favoriteGenre(UPDATED_FAVORITE_GENRE)
            .musicPurpose(UPDATED_MUSIC_PURPOSE)
            .musicMood(UPDATED_MUSIC_MOOD)
            .vocalPreference(UPDATED_VOCAL_PREFERENCE)
            .listeningTime(UPDATED_LISTENING_TIME)
            .listeningPattern(UPDATED_LISTENING_PATTERN)
            .songLength(UPDATED_SONG_LENGTH)
            .lyricsImportance(UPDATED_LYRICS_IMPORTANCE);
    }

    @BeforeEach
    public void initTest() {
        userPreference = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedUserPreference != null) {
            userPreferenceRepository.delete(insertedUserPreference);
            insertedUserPreference = null;
        }
    }

    @Test
    @Transactional
    void createUserPreference() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the UserPreference
        var returnedUserPreference = om.readValue(
            restUserPreferenceMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userPreference)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            UserPreference.class
        );

        // Validate the UserPreference in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertUserPreferenceUpdatableFieldsEquals(returnedUserPreference, getPersistedUserPreference(returnedUserPreference));

        insertedUserPreference = returnedUserPreference;
    }

    @Test
    @Transactional
    void createUserPreferenceWithExistingId() throws Exception {
        // Create the UserPreference with an existing ID
        userPreference.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserPreferenceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userPreference)))
            .andExpect(status().isBadRequest());

        // Validate the UserPreference in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserPreferences() throws Exception {
        // Initialize the database
        insertedUserPreference = userPreferenceRepository.saveAndFlush(userPreference);

        // Get all the userPreferenceList
        restUserPreferenceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userPreference.getId().intValue())))
            .andExpect(jsonPath("$.[*].favoriteGenre").value(hasItem(DEFAULT_FAVORITE_GENRE)))
            .andExpect(jsonPath("$.[*].musicPurpose").value(hasItem(DEFAULT_MUSIC_PURPOSE)))
            .andExpect(jsonPath("$.[*].musicMood").value(hasItem(DEFAULT_MUSIC_MOOD)))
            .andExpect(jsonPath("$.[*].vocalPreference").value(hasItem(DEFAULT_VOCAL_PREFERENCE)))
            .andExpect(jsonPath("$.[*].listeningTime").value(hasItem(DEFAULT_LISTENING_TIME)))
            .andExpect(jsonPath("$.[*].listeningPattern").value(hasItem(DEFAULT_LISTENING_PATTERN)))
            .andExpect(jsonPath("$.[*].songLength").value(hasItem(DEFAULT_SONG_LENGTH)))
            .andExpect(jsonPath("$.[*].lyricsImportance").value(hasItem(DEFAULT_LYRICS_IMPORTANCE)));
    }

    @Test
    @Transactional
    void getUserPreference() throws Exception {
        // Initialize the database
        insertedUserPreference = userPreferenceRepository.saveAndFlush(userPreference);

        // Get the userPreference
        restUserPreferenceMockMvc
            .perform(get(ENTITY_API_URL_ID, userPreference.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userPreference.getId().intValue()))
            .andExpect(jsonPath("$.favoriteGenre").value(DEFAULT_FAVORITE_GENRE))
            .andExpect(jsonPath("$.musicPurpose").value(DEFAULT_MUSIC_PURPOSE))
            .andExpect(jsonPath("$.musicMood").value(DEFAULT_MUSIC_MOOD))
            .andExpect(jsonPath("$.vocalPreference").value(DEFAULT_VOCAL_PREFERENCE))
            .andExpect(jsonPath("$.listeningTime").value(DEFAULT_LISTENING_TIME))
            .andExpect(jsonPath("$.listeningPattern").value(DEFAULT_LISTENING_PATTERN))
            .andExpect(jsonPath("$.songLength").value(DEFAULT_SONG_LENGTH))
            .andExpect(jsonPath("$.lyricsImportance").value(DEFAULT_LYRICS_IMPORTANCE));
    }

    @Test
    @Transactional
    void getNonExistingUserPreference() throws Exception {
        // Get the userPreference
        restUserPreferenceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserPreference() throws Exception {
        // Initialize the database
        insertedUserPreference = userPreferenceRepository.saveAndFlush(userPreference);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userPreference
        UserPreference updatedUserPreference = userPreferenceRepository.findById(userPreference.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedUserPreference are not directly saved in db
        em.detach(updatedUserPreference);
        updatedUserPreference
            .favoriteGenre(UPDATED_FAVORITE_GENRE)
            .musicPurpose(UPDATED_MUSIC_PURPOSE)
            .musicMood(UPDATED_MUSIC_MOOD)
            .vocalPreference(UPDATED_VOCAL_PREFERENCE)
            .listeningTime(UPDATED_LISTENING_TIME)
            .listeningPattern(UPDATED_LISTENING_PATTERN)
            .songLength(UPDATED_SONG_LENGTH)
            .lyricsImportance(UPDATED_LYRICS_IMPORTANCE);

        restUserPreferenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserPreference.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedUserPreference))
            )
            .andExpect(status().isOk());

        // Validate the UserPreference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedUserPreferenceToMatchAllProperties(updatedUserPreference);
    }

    @Test
    @Transactional
    void putNonExistingUserPreference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreference.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPreferenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userPreference.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(userPreference))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPreference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserPreference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreference.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPreferenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(userPreference))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPreference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserPreference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreference.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPreferenceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userPreference)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPreference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserPreferenceWithPatch() throws Exception {
        // Initialize the database
        insertedUserPreference = userPreferenceRepository.saveAndFlush(userPreference);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userPreference using partial update
        UserPreference partialUpdatedUserPreference = new UserPreference();
        partialUpdatedUserPreference.setId(userPreference.getId());

        partialUpdatedUserPreference
            .musicMood(UPDATED_MUSIC_MOOD)
            .vocalPreference(UPDATED_VOCAL_PREFERENCE)
            .listeningTime(UPDATED_LISTENING_TIME);

        restUserPreferenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPreference.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUserPreference))
            )
            .andExpect(status().isOk());

        // Validate the UserPreference in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUserPreferenceUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedUserPreference, userPreference),
            getPersistedUserPreference(userPreference)
        );
    }

    @Test
    @Transactional
    void fullUpdateUserPreferenceWithPatch() throws Exception {
        // Initialize the database
        insertedUserPreference = userPreferenceRepository.saveAndFlush(userPreference);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userPreference using partial update
        UserPreference partialUpdatedUserPreference = new UserPreference();
        partialUpdatedUserPreference.setId(userPreference.getId());

        partialUpdatedUserPreference
            .favoriteGenre(UPDATED_FAVORITE_GENRE)
            .musicPurpose(UPDATED_MUSIC_PURPOSE)
            .musicMood(UPDATED_MUSIC_MOOD)
            .vocalPreference(UPDATED_VOCAL_PREFERENCE)
            .listeningTime(UPDATED_LISTENING_TIME)
            .listeningPattern(UPDATED_LISTENING_PATTERN)
            .songLength(UPDATED_SONG_LENGTH)
            .lyricsImportance(UPDATED_LYRICS_IMPORTANCE);

        restUserPreferenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPreference.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUserPreference))
            )
            .andExpect(status().isOk());

        // Validate the UserPreference in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUserPreferenceUpdatableFieldsEquals(partialUpdatedUserPreference, getPersistedUserPreference(partialUpdatedUserPreference));
    }

    @Test
    @Transactional
    void patchNonExistingUserPreference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreference.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPreferenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userPreference.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(userPreference))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPreference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserPreference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreference.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPreferenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(userPreference))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPreference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserPreference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreference.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPreferenceMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(userPreference)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPreference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserPreference() throws Exception {
        // Initialize the database
        insertedUserPreference = userPreferenceRepository.saveAndFlush(userPreference);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the userPreference
        restUserPreferenceMockMvc
            .perform(delete(ENTITY_API_URL_ID, userPreference.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return userPreferenceRepository.count();
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

    protected UserPreference getPersistedUserPreference(UserPreference userPreference) {
        return userPreferenceRepository.findById(userPreference.getId()).orElseThrow();
    }

    protected void assertPersistedUserPreferenceToMatchAllProperties(UserPreference expectedUserPreference) {
        assertUserPreferenceAllPropertiesEquals(expectedUserPreference, getPersistedUserPreference(expectedUserPreference));
    }

    protected void assertPersistedUserPreferenceToMatchUpdatableProperties(UserPreference expectedUserPreference) {
        assertUserPreferenceAllUpdatablePropertiesEquals(expectedUserPreference, getPersistedUserPreference(expectedUserPreference));
    }
}
