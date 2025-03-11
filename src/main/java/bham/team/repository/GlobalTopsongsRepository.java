package bham.team.repository;

import bham.team.domain.GlobalTopsongs;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GlobalTopsongs entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GlobalTopsongsRepository extends JpaRepository<GlobalTopsongs, Long> {}
