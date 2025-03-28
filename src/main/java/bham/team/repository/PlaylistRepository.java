package bham.team.repository;

import bham.team.domain.Playlist;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Playlist entity.
 *
 * When extending this class, extend PlaylistRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface PlaylistRepository extends PlaylistRepositoryWithBagRelationships, JpaRepository<Playlist, Long> {
    default Optional<Playlist> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Playlist> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Playlist> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    default List<Playlist> findByUserIdWithEagerRelationships(Long userId) {
        return this.findByUserIdWithEagerRelationships(userId);
    }

    @Query("select playlist from Playlist playlist where playlist.user.login = ?#{authentication.name}")
    List<Playlist> findByUserIsCurrentUser();

    @Query("select playlist from Playlist playlist where playlist.user.id = :userId")
    List<Playlist> findByUserId(@Param("userId") Long userId);

    @Query(
        value = "select playlist from Playlist playlist left join fetch playlist.user",
        countQuery = "select count(playlist) from Playlist playlist"
    )

    Page<Playlist> findAllWithToOneRelationships(Pageable pageable);

    @Query("select playlist from Playlist playlist left join fetch playlist.user")
    List<Playlist> findAllWithToOneRelationships();

    @Query("select playlist from Playlist playlist left join fetch playlist.user where playlist.id =:id")
    Optional<Playlist> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("SELECT playlist FROM Playlist playlist left join fetch playlist.user where p.user.id = :userId")
    List<Playlist> findByUserIdWithEagerRelationships(@Param("userId") Long userId);
}
