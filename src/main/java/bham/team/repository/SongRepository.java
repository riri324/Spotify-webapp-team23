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

    @Query(
        """
            SELECT DISTINCT s
            FROM Song s
            JOIN s.playlists p
            WHERE p.user.login = :login
        """
    )
    List<Song> findSongsByUserLogin(@Param("login") String login);

    @Query(
        """
            SELECT DISTINCT s.trackName
            FROM Song s
            JOIN s.playlists p1
            JOIN p1.user u1
            WHERE u1.login = :user1
              AND s.songId IN (
                  SELECT s2.songId
                  FROM Song s2
                  JOIN s2.playlists p2
                  JOIN p2.user u2
                  WHERE u2.login = :user2
              )
        """
    )
    List<String> findCommonSongNamesBetweenUsers(@Param("user1") String user1, @Param("user2") String user2);
}
