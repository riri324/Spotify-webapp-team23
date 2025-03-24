package bham.team.repository;

import bham.team.domain.Song;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Song entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    @Query(
        """
            SELECT s.id
            FROM Playlist p
            JOIN p.songs s
            WHERE p.user.login = :userId
        """
    )
    List<String> findSongIdsByUserId(@Param("userId") String userId);
}
