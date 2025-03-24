package bham.team.service;

import bham.team.domain.Recommend;
import bham.team.repository.RecommendRepository;
import bham.team.repository.SongRepository; // ✅ You'll need this for song queries
import bham.team.service.dto.RecommendDTO;
import bham.team.service.mapper.RecommendMapper;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link bham.team.domain.Recommend}.
 */
@Service
@Transactional
public class RecommendService {

    private static final Logger LOG = LoggerFactory.getLogger(RecommendService.class);

    private final RecommendRepository recommendRepository;
    private final RecommendMapper recommendMapper;
    private final SongRepository songRepository; // ✅ Injected for song queries

    public RecommendService(RecommendRepository recommendRepository, RecommendMapper recommendMapper, SongRepository songRepository) {
        this.recommendRepository = recommendRepository;
        this.recommendMapper = recommendMapper;
        this.songRepository = songRepository;
    }

    public RecommendDTO save(RecommendDTO recommendDTO) {
        LOG.debug("Request to save Recommend : {}", recommendDTO);
        Recommend recommend = recommendMapper.toEntity(recommendDTO);
        recommend = recommendRepository.save(recommend);
        return recommendMapper.toDto(recommend);
    }

    public RecommendDTO update(RecommendDTO recommendDTO) {
        LOG.debug("Request to update Recommend : {}", recommendDTO);
        Recommend recommend = recommendMapper.toEntity(recommendDTO);
        recommend = recommendRepository.save(recommend);
        return recommendMapper.toDto(recommend);
    }

    public Optional<RecommendDTO> partialUpdate(RecommendDTO recommendDTO) {
        LOG.debug("Request to partially update Recommend : {}", recommendDTO);

        return recommendRepository
            .findById(recommendDTO.getId())
            .map(existingRecommend -> {
                recommendMapper.partialUpdate(existingRecommend, recommendDTO);
                return existingRecommend;
            })
            .map(recommendRepository::save)
            .map(recommendMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<RecommendDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Recommends");
        return recommendRepository.findAll(pageable).map(recommendMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<RecommendDTO> findOne(Long id) {
        LOG.debug("Request to get Recommend : {}", id);
        return recommendRepository.findById(id).map(recommendMapper::toDto);
    }

    public void delete(Long id) {
        LOG.debug("Request to delete Recommend : {}", id);
        recommendRepository.deleteById(id);
    }

    public void generateRecommendationsForUser(String userId) {
        LOG.debug("Generating recommendations for user: {}", userId);

        recommendRepository.deleteByUserId(userId);

        List<String> currentUserSongIds = songRepository.findSongIdsByUserId(userId); // ✅ Assuming you have this query!

        if (currentUserSongIds.isEmpty()) {
            LOG.info("User {} has no songs, skipping recommendations", userId);
            return;
        }

        List<Object[]> similarUsers = recommendRepository.findSimilarUsers(userId, 5);

        for (Object[] row : similarUsers) {
            String recommendedUserId = (String) row[0];
            Long commonSongsCount = (Long) row[1];

            Recommend recommend = new Recommend()
                .userId(userId)
                .recommendedUserId(recommendedUserId)
                .commonSongsCount(commonSongsCount.intValue());

            recommendRepository.save(recommend);
        }

        LOG.info("Recommendations generated for user: {}", userId);
    }

    @Transactional(readOnly = true)
    public List<RecommendDTO> findAllDTOByUserId(String userId) {
        LOG.debug("Fetching all recommendations for user: {}", userId);
        return recommendRepository.findAllByUserId(userId).stream().map(recommendMapper::toDto).toList();
    }
}
