package bham.team.repository;

import bham.team.domain.LikedSongs;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LikedSongs entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LikedSongsRepository extends JpaRepository<LikedSongs, Long> {}
