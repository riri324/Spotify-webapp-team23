package bham.team.service;

import bham.team.domain.Feedback;
import bham.team.repository.FeedbackRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link bham.team.domain.Feedback}.
 */
@Service
@Transactional
public class FeedbackService {

    private static final Logger LOG = LoggerFactory.getLogger(FeedbackService.class);

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    /**
     * Save a feedback.
     *
     * @param feedback the entity to save.
     * @return the persisted entity.
     */
    public Feedback save(Feedback feedback) {
        LOG.debug("Request to save Feedback : {}", feedback);
        return feedbackRepository.save(feedback);
    }

    /**
     * Update a feedback.
     *
     * @param feedback the entity to save.
     * @return the persisted entity.
     */
    public Feedback update(Feedback feedback) {
        LOG.debug("Request to update Feedback : {}", feedback);
        return feedbackRepository.save(feedback);
    }

    /**
     * Partially update a feedback.
     *
     * @param feedback the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Feedback> partialUpdate(Feedback feedback) {
        LOG.debug("Request to partially update Feedback : {}", feedback);

        return feedbackRepository
            .findById(feedback.getId())
            .map(existingFeedback -> {
                if (feedback.getFeedbackId() != null) {
                    existingFeedback.setFeedbackId(feedback.getFeedbackId());
                }
                if (feedback.getUsername() != null) {
                    existingFeedback.setUsername(feedback.getUsername());
                }
                if (feedback.getUserEmail() != null) {
                    existingFeedback.setUserEmail(feedback.getUserEmail());
                }
                if (feedback.getUserPhineNum() != null) {
                    existingFeedback.setUserPhineNum(feedback.getUserPhineNum());
                }
                if (feedback.getMessage() != null) {
                    existingFeedback.setMessage(feedback.getMessage());
                }
                if (feedback.getRating() != null) {
                    existingFeedback.setRating(feedback.getRating());
                }

                return existingFeedback;
            })
            .map(feedbackRepository::save);
    }

    /**
     * Get all the feedbacks.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Feedback> findAll(Pageable pageable) {
        LOG.debug("Request to get all Feedbacks");
        return feedbackRepository.findAll(pageable);
    }

    /**
     * Get all the feedbacks with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Feedback> findAllWithEagerRelationships(Pageable pageable) {
        return feedbackRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one feedback by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Feedback> findOne(Long id) {
        LOG.debug("Request to get Feedback : {}", id);
        return feedbackRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the feedback by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Feedback : {}", id);
        feedbackRepository.deleteById(id);
    }
}
