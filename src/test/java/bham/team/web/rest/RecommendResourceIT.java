package bham.team.web.rest;

import static bham.team.domain.RecommendAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.Recommend;
import bham.team.repository.RecommendRepository;
import bham.team.service.dto.RecommendDTO;
import bham.team.service.mapper.RecommendMapper;
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
 * Integration tests for the {@link RecommendResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RecommendResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_RECOMMENDED_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_RECOMMENDED_USER_ID = "BBBBBBBBBB";

    private static final Integer DEFAULT_COMMON_SONGS_COUNT = 5;
    private static final Integer UPDATED_COMMON_SONGS_COUNT = 6;

    private static final String ENTITY_API_URL = "/api/recommends";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private RecommendRepository recommendRepository;

    @Autowired
    private RecommendMapper recommendMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRecommendMockMvc;

    private Recommend recommend;

    private Recommend insertedRecommend;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Recommend createEntity() {
        return new Recommend()
            .userId(DEFAULT_USER_ID)
            .recommendedUserId(DEFAULT_RECOMMENDED_USER_ID)
            .commonSongsCount(DEFAULT_COMMON_SONGS_COUNT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Recommend createUpdatedEntity() {
        return new Recommend()
            .userId(UPDATED_USER_ID)
            .recommendedUserId(UPDATED_RECOMMENDED_USER_ID)
            .commonSongsCount(UPDATED_COMMON_SONGS_COUNT);
    }

    @BeforeEach
    public void initTest() {
        recommend = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedRecommend != null) {
            recommendRepository.delete(insertedRecommend);
            insertedRecommend = null;
        }
    }

    @Test
    @Transactional
    void createRecommend() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Recommend
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);
        var returnedRecommendDTO = om.readValue(
            restRecommendMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(recommendDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            RecommendDTO.class
        );

        // Validate the Recommend in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedRecommend = recommendMapper.toEntity(returnedRecommendDTO);
        assertRecommendUpdatableFieldsEquals(returnedRecommend, getPersistedRecommend(returnedRecommend));

        insertedRecommend = returnedRecommend;
    }

    @Test
    @Transactional
    void createRecommendWithExistingId() throws Exception {
        // Create the Recommend with an existing ID
        recommend.setId(1L);
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRecommendMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(recommendDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Recommend in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUserIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        recommend.setUserId(null);

        // Create the Recommend, which fails.
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);

        restRecommendMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(recommendDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkRecommendedUserIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        recommend.setRecommendedUserId(null);

        // Create the Recommend, which fails.
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);

        restRecommendMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(recommendDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCommonSongsCountIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        recommend.setCommonSongsCount(null);

        // Create the Recommend, which fails.
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);

        restRecommendMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(recommendDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRecommends() throws Exception {
        // Initialize the database
        insertedRecommend = recommendRepository.saveAndFlush(recommend);

        // Get all the recommendList
        restRecommendMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(recommend.getId().intValue())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].recommendedUserId").value(hasItem(DEFAULT_RECOMMENDED_USER_ID)))
            .andExpect(jsonPath("$.[*].commonSongsCount").value(hasItem(DEFAULT_COMMON_SONGS_COUNT)));
    }

    @Test
    @Transactional
    void getRecommend() throws Exception {
        // Initialize the database
        insertedRecommend = recommendRepository.saveAndFlush(recommend);

        // Get the recommend
        restRecommendMockMvc
            .perform(get(ENTITY_API_URL_ID, recommend.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(recommend.getId().intValue()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.recommendedUserId").value(DEFAULT_RECOMMENDED_USER_ID))
            .andExpect(jsonPath("$.commonSongsCount").value(DEFAULT_COMMON_SONGS_COUNT));
    }

    @Test
    @Transactional
    void getNonExistingRecommend() throws Exception {
        // Get the recommend
        restRecommendMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRecommend() throws Exception {
        // Initialize the database
        insertedRecommend = recommendRepository.saveAndFlush(recommend);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the recommend
        Recommend updatedRecommend = recommendRepository.findById(recommend.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRecommend are not directly saved in db
        em.detach(updatedRecommend);
        updatedRecommend
            .userId(UPDATED_USER_ID)
            .recommendedUserId(UPDATED_RECOMMENDED_USER_ID)
            .commonSongsCount(UPDATED_COMMON_SONGS_COUNT);
        RecommendDTO recommendDTO = recommendMapper.toDto(updatedRecommend);

        restRecommendMockMvc
            .perform(
                put(ENTITY_API_URL_ID, recommendDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(recommendDTO))
            )
            .andExpect(status().isOk());

        // Validate the Recommend in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedRecommendToMatchAllProperties(updatedRecommend);
    }

    @Test
    @Transactional
    void putNonExistingRecommend() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recommend.setId(longCount.incrementAndGet());

        // Create the Recommend
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRecommendMockMvc
            .perform(
                put(ENTITY_API_URL_ID, recommendDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(recommendDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recommend in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRecommend() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recommend.setId(longCount.incrementAndGet());

        // Create the Recommend
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecommendMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(recommendDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recommend in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRecommend() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recommend.setId(longCount.incrementAndGet());

        // Create the Recommend
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecommendMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(recommendDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Recommend in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRecommendWithPatch() throws Exception {
        // Initialize the database
        insertedRecommend = recommendRepository.saveAndFlush(recommend);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the recommend using partial update
        Recommend partialUpdatedRecommend = new Recommend();
        partialUpdatedRecommend.setId(recommend.getId());

        partialUpdatedRecommend.userId(UPDATED_USER_ID).recommendedUserId(UPDATED_RECOMMENDED_USER_ID);

        restRecommendMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRecommend.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRecommend))
            )
            .andExpect(status().isOk());

        // Validate the Recommend in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRecommendUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedRecommend, recommend),
            getPersistedRecommend(recommend)
        );
    }

    @Test
    @Transactional
    void fullUpdateRecommendWithPatch() throws Exception {
        // Initialize the database
        insertedRecommend = recommendRepository.saveAndFlush(recommend);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the recommend using partial update
        Recommend partialUpdatedRecommend = new Recommend();
        partialUpdatedRecommend.setId(recommend.getId());

        partialUpdatedRecommend
            .userId(UPDATED_USER_ID)
            .recommendedUserId(UPDATED_RECOMMENDED_USER_ID)
            .commonSongsCount(UPDATED_COMMON_SONGS_COUNT);

        restRecommendMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRecommend.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRecommend))
            )
            .andExpect(status().isOk());

        // Validate the Recommend in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRecommendUpdatableFieldsEquals(partialUpdatedRecommend, getPersistedRecommend(partialUpdatedRecommend));
    }

    @Test
    @Transactional
    void patchNonExistingRecommend() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recommend.setId(longCount.incrementAndGet());

        // Create the Recommend
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRecommendMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, recommendDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(recommendDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recommend in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRecommend() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recommend.setId(longCount.incrementAndGet());

        // Create the Recommend
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecommendMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(recommendDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recommend in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRecommend() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recommend.setId(longCount.incrementAndGet());

        // Create the Recommend
        RecommendDTO recommendDTO = recommendMapper.toDto(recommend);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecommendMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(recommendDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Recommend in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRecommend() throws Exception {
        // Initialize the database
        insertedRecommend = recommendRepository.saveAndFlush(recommend);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the recommend
        restRecommendMockMvc
            .perform(delete(ENTITY_API_URL_ID, recommend.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return recommendRepository.count();
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

    protected Recommend getPersistedRecommend(Recommend recommend) {
        return recommendRepository.findById(recommend.getId()).orElseThrow();
    }

    protected void assertPersistedRecommendToMatchAllProperties(Recommend expectedRecommend) {
        assertRecommendAllPropertiesEquals(expectedRecommend, getPersistedRecommend(expectedRecommend));
    }

    protected void assertPersistedRecommendToMatchUpdatableProperties(Recommend expectedRecommend) {
        assertRecommendAllUpdatablePropertiesEquals(expectedRecommend, getPersistedRecommend(expectedRecommend));
    }
}
