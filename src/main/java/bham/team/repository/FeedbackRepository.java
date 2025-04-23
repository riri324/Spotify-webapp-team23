package bham.team.repository;

import bham.team.domain.Feedback;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Feedback entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // 지금은 연관 관계 없음 → 그냥 기본 메소드 형태로 정의
    default Page<Feedback> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAll(pageable);
    }

    default Optional<Feedback> findOneWithEagerRelationships(Long id) {
        return this.findById(id);
    }
}
