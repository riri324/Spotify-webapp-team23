package bham.team.repository;

import bham.team.domain.Recommend;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data JPA repository for the Recommend entity.
 */
@Repository
public interface RecommendRepository extends JpaRepository<Recommend, Long> {
    List<Recommend> findAllByUserId(String userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Recommend r WHERE r.userId = :userId")
    void deleteByUserId(@Param("userId") String userId);

    @Query(
        """
            SELECT p.user.login, COUNT(s.id)
            FROM Playlist p
            JOIN p.songs s
            WHERE p.user.login != :userId
            AND s.id IN (
                SELECT s2.id
                FROM Playlist p2
                JOIN p2.songs s2
                WHERE p2.user.login = :userId
            )
            GROUP BY p.user.login
            HAVING COUNT(s.id) >= :minCommonSongs
        """
    )
    List<Object[]> findSimilarUsers(@Param("userId") String userId, @Param("minCommonSongs") long minCommonSongs);
}
