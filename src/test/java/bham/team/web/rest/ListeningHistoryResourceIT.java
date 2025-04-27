package bham.team.web.rest;

import static bham.team.domain.ListeningHistoryAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.ListeningHistory;
import bham.team.repository.ListeningHistoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link ListeningHistoryResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ListeningHistoryResourceIT {

    private static final Integer DEFAULT_HISTORY_ID = 1;
    private static final Integer UPDATED_HISTORY_ID = 2;

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/listening-histories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ListeningHistoryRepository listeningHistoryRepository;

    @Mock
    private ListeningHistoryRepository listeningHistoryRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restListeningHistoryMockMvc;

    private ListeningHistory listeningHistory;

    private ListeningHistory insertedListeningHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ListeningHistory createEntity() {
        return new ListeningHistory().historyID(DEFAULT_HISTORY_ID).timestamp(DEFAULT_TIMESTAMP);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ListeningHistory createUpdatedEntity() {
        return new ListeningHistory().historyID(UPDATED_HISTORY_ID).timestamp(UPDATED_TIMESTAMP);
    }

    @BeforeEach
    public void initTest() {
        listeningHistory = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedListeningHistory != null) {
            listeningHistoryRepository.delete(insertedListeningHistory);
            insertedListeningHistory = null;
        }
    }

    @Test
    @Transactional
    void createListeningHistory() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ListeningHistory
        var returnedListeningHistory = om.readValue(
            restListeningHistoryMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(listeningHistory)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ListeningHistory.class
        );

        // Validate the ListeningHistory in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertListeningHistoryUpdatableFieldsEquals(returnedListeningHistory, getPersistedListeningHistory(returnedListeningHistory));

        insertedListeningHistory = returnedListeningHistory;
    }

    @Test
    @Transactional
    void createListeningHistoryWithExistingId() throws Exception {
        // Create the ListeningHistory with an existing ID
        listeningHistory.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restListeningHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(listeningHistory)))
            .andExpect(status().isBadRequest());

        // Validate the ListeningHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkHistoryIDIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        listeningHistory.setHistoryID(null);

        // Create the ListeningHistory, which fails.

        restListeningHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(listeningHistory)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTimestampIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        listeningHistory.setTimestamp(null);

        // Create the ListeningHistory, which fails.

        restListeningHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(listeningHistory)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllListeningHistories() throws Exception {
        // Initialize the database
        insertedListeningHistory = listeningHistoryRepository.saveAndFlush(listeningHistory);

        // Get all the listeningHistoryList
        restListeningHistoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(listeningHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].historyID").value(hasItem(DEFAULT_HISTORY_ID)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllListeningHistoriesWithEagerRelationshipsIsEnabled() throws Exception {
        when(listeningHistoryRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restListeningHistoryMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(listeningHistoryRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllListeningHistoriesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(listeningHistoryRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restListeningHistoryMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(listeningHistoryRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getListeningHistory() throws Exception {
        // Initialize the database
        insertedListeningHistory = listeningHistoryRepository.saveAndFlush(listeningHistory);

        // Get the listeningHistory
        restListeningHistoryMockMvc
            .perform(get(ENTITY_API_URL_ID, listeningHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(listeningHistory.getId().intValue()))
            .andExpect(jsonPath("$.historyID").value(DEFAULT_HISTORY_ID))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingListeningHistory() throws Exception {
        // Get the listeningHistory
        restListeningHistoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingListeningHistory() throws Exception {
        // Initialize the database
        insertedListeningHistory = listeningHistoryRepository.saveAndFlush(listeningHistory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the listeningHistory
        ListeningHistory updatedListeningHistory = listeningHistoryRepository.findById(listeningHistory.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedListeningHistory are not directly saved in db
        em.detach(updatedListeningHistory);
        updatedListeningHistory.historyID(UPDATED_HISTORY_ID).timestamp(UPDATED_TIMESTAMP);

        restListeningHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedListeningHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedListeningHistory))
            )
            .andExpect(status().isOk());

        // Validate the ListeningHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedListeningHistoryToMatchAllProperties(updatedListeningHistory);
    }

    @Test
    @Transactional
    void putNonExistingListeningHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listeningHistory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restListeningHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, listeningHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(listeningHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListeningHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchListeningHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listeningHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListeningHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(listeningHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListeningHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamListeningHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listeningHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListeningHistoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(listeningHistory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ListeningHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateListeningHistoryWithPatch() throws Exception {
        // Initialize the database
        insertedListeningHistory = listeningHistoryRepository.saveAndFlush(listeningHistory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the listeningHistory using partial update
        ListeningHistory partialUpdatedListeningHistory = new ListeningHistory();
        partialUpdatedListeningHistory.setId(listeningHistory.getId());

        partialUpdatedListeningHistory.historyID(UPDATED_HISTORY_ID);

        restListeningHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedListeningHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedListeningHistory))
            )
            .andExpect(status().isOk());

        // Validate the ListeningHistory in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertListeningHistoryUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedListeningHistory, listeningHistory),
            getPersistedListeningHistory(listeningHistory)
        );
    }

    @Test
    @Transactional
    void fullUpdateListeningHistoryWithPatch() throws Exception {
        // Initialize the database
        insertedListeningHistory = listeningHistoryRepository.saveAndFlush(listeningHistory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the listeningHistory using partial update
        ListeningHistory partialUpdatedListeningHistory = new ListeningHistory();
        partialUpdatedListeningHistory.setId(listeningHistory.getId());

        partialUpdatedListeningHistory.historyID(UPDATED_HISTORY_ID).timestamp(UPDATED_TIMESTAMP);

        restListeningHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedListeningHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedListeningHistory))
            )
            .andExpect(status().isOk());

        // Validate the ListeningHistory in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertListeningHistoryUpdatableFieldsEquals(
            partialUpdatedListeningHistory,
            getPersistedListeningHistory(partialUpdatedListeningHistory)
        );
    }

    @Test
    @Transactional
    void patchNonExistingListeningHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listeningHistory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restListeningHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, listeningHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(listeningHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListeningHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchListeningHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listeningHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListeningHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(listeningHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListeningHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamListeningHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listeningHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListeningHistoryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(listeningHistory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ListeningHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteListeningHistory() throws Exception {
        // Initialize the database
        insertedListeningHistory = listeningHistoryRepository.saveAndFlush(listeningHistory);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the listeningHistory
        restListeningHistoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, listeningHistory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return listeningHistoryRepository.count();
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

    protected ListeningHistory getPersistedListeningHistory(ListeningHistory listeningHistory) {
        return listeningHistoryRepository.findById(listeningHistory.getId()).orElseThrow();
    }

    protected void assertPersistedListeningHistoryToMatchAllProperties(ListeningHistory expectedListeningHistory) {
        assertListeningHistoryAllPropertiesEquals(expectedListeningHistory, getPersistedListeningHistory(expectedListeningHistory));
    }

    protected void assertPersistedListeningHistoryToMatchUpdatableProperties(ListeningHistory expectedListeningHistory) {
        assertListeningHistoryAllUpdatablePropertiesEquals(
            expectedListeningHistory,
            getPersistedListeningHistory(expectedListeningHistory)
        );
    }
}
