package bham.team.repository;

import bham.team.domain.Concert;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Concert entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConcertRepository extends JpaRepository<Concert, Long>, JpaSpecificationExecutor<Concert> {
    // Add the method inside the interface
    List<Concert> findByCountry(String country);
}
