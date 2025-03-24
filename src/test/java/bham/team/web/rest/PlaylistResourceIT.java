package bham.team.web.rest;

import static bham.team.domain.PlaylistAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.Playlist;
import bham.team.domain.User;
import bham.team.repository.PlaylistRepository;
import bham.team.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PlaylistResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PlaylistResourceIT {

    private static final Integer DEFAULT_PLAYLIST_ID = 1;
    private static final Integer UPDATED_PLAYLIST_ID = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_PUBLIC = false;
    private static final Boolean UPDATED_IS_PUBLIC = true;

    private static final String ENTITY_API_URL = "/api/playlists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private PlaylistRepository playlistRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlaylistMockMvc;

    private Playlist playlist;

    private Playlist insertedPlaylist;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Playlist createEntity(EntityManager em) {
        Playlist playlist = new Playlist()
            .playlistID(DEFAULT_PLAYLIST_ID)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .isPublic(DEFAULT_IS_PUBLIC);
        // Add required entity
        User user = UserResourceIT.createEntity();
        em.persist(user);
        em.flush();
        playlist.setUser(user);
        return playlist;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Playlist createUpdatedEntity(EntityManager em) {
        Playlist updatedPlaylist = new Playlist()
            .playlistID(UPDATED_PLAYLIST_ID)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .isPublic(UPDATED_IS_PUBLIC);
        // Add required entity
        User user = UserResourceIT.createEntity();
        em.persist(user);
        em.flush();
        updatedPlaylist.setUser(user);
        return updatedPlaylist;
    }

    @BeforeEach
    public void initTest() {
        playlist = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedPlaylist != null) {
            playlistRepository.delete(insertedPlaylist);
            insertedPlaylist = null;
        }
    }

    @Test
    @Transactional
    void createPlaylist() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Playlist
        var returnedPlaylist = om.readValue(
            restPlaylistMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlist)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Playlist.class
        );

        // Validate the Playlist in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPlaylistUpdatableFieldsEquals(returnedPlaylist, getPersistedPlaylist(returnedPlaylist));

        insertedPlaylist = returnedPlaylist;
    }

    @Test
    @Transactional
    void createPlaylistWithExistingId() throws Exception {
        // Create the Playlist with an existing ID
        playlist.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlaylistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlist)))
            .andExpect(status().isBadRequest());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPlaylistIDIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        playlist.setPlaylistID(null);

        // Create the Playlist, which fails.

        restPlaylistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlist)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        playlist.setName(null);

        // Create the Playlist, which fails.

        restPlaylistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlist)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIsPublicIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        playlist.setIsPublic(null);

        // Create the Playlist, which fails.

        restPlaylistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlist)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPlaylists() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        // Get all the playlistList
        restPlaylistMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(playlist.getId().intValue())))
            .andExpect(jsonPath("$.[*].playlistID").value(hasItem(DEFAULT_PLAYLIST_ID)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].isPublic").value(hasItem(DEFAULT_IS_PUBLIC.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPlaylistsWithEagerRelationshipsIsEnabled() throws Exception {
        when(playlistRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPlaylistMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(playlistRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPlaylistsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(playlistRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPlaylistMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(playlistRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPlaylist() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        // Get the playlist
        restPlaylistMockMvc
            .perform(get(ENTITY_API_URL_ID, playlist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(playlist.getId().intValue()))
            .andExpect(jsonPath("$.playlistID").value(DEFAULT_PLAYLIST_ID))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.isPublic").value(DEFAULT_IS_PUBLIC.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingPlaylist() throws Exception {
        // Get the playlist
        restPlaylistMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlaylist() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playlist
        Playlist updatedPlaylist = playlistRepository.findById(playlist.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPlaylist are not directly saved in db
        em.detach(updatedPlaylist);
        updatedPlaylist.playlistID(UPDATED_PLAYLIST_ID).name(UPDATED_NAME).description(UPDATED_DESCRIPTION).isPublic(UPDATED_IS_PUBLIC);

        restPlaylistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlaylist.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPlaylist))
            )
            .andExpect(status().isOk());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPlaylistToMatchAllProperties(updatedPlaylist);
    }

    @Test
    @Transactional
    void putNonExistingPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, playlist.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playlist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlist)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlaylistWithPatch() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playlist using partial update
        Playlist partialUpdatedPlaylist = new Playlist();
        partialUpdatedPlaylist.setId(playlist.getId());

        partialUpdatedPlaylist.name(UPDATED_NAME);

        restPlaylistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlaylist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlaylist))
            )
            .andExpect(status().isOk());

        // Validate the Playlist in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlaylistUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPlaylist, playlist), getPersistedPlaylist(playlist));
    }

    @Test
    @Transactional
    void fullUpdatePlaylistWithPatch() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playlist using partial update
        Playlist partialUpdatedPlaylist = new Playlist();
        partialUpdatedPlaylist.setId(playlist.getId());

        partialUpdatedPlaylist
            .playlistID(UPDATED_PLAYLIST_ID)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .isPublic(UPDATED_IS_PUBLIC);

        restPlaylistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlaylist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlaylist))
            )
            .andExpect(status().isOk());

        // Validate the Playlist in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlaylistUpdatableFieldsEquals(partialUpdatedPlaylist, getPersistedPlaylist(partialUpdatedPlaylist));
    }

    @Test
    @Transactional
    void patchNonExistingPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, playlist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(playlist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(playlist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(playlist)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlaylist() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the playlist
        restPlaylistMockMvc
            .perform(delete(ENTITY_API_URL_ID, playlist.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return playlistRepository.count();
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

    protected Playlist getPersistedPlaylist(Playlist playlist) {
        return playlistRepository.findById(playlist.getId()).orElseThrow();
    }

    protected void assertPersistedPlaylistToMatchAllProperties(Playlist expectedPlaylist) {
        assertPlaylistAllPropertiesEquals(expectedPlaylist, getPersistedPlaylist(expectedPlaylist));
    }

    protected void assertPersistedPlaylistToMatchUpdatableProperties(Playlist expectedPlaylist) {
        assertPlaylistAllUpdatablePropertiesEquals(expectedPlaylist, getPersistedPlaylist(expectedPlaylist));
    }
}
