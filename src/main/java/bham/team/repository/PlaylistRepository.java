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
    @Query("select playlist from Playlist playlist where playlist.user.login = ?#{authentication.name}")
    List<Playlist> findByUserIsCurrentUser();

    default Optional<Playlist> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Playlist> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Playlist> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select playlist from Playlist playlist left join fetch playlist.user",
        countQuery = "select count(playlist) from Playlist playlist"
    )
    Page<Playlist> findAllWithToOneRelationships(Pageable pageable);

    @Query("select playlist from Playlist playlist left join fetch playlist.user")
    List<Playlist> findAllWithToOneRelationships();

    @Query("select playlist from Playlist playlist left join fetch playlist.user where playlist.id =:id")
    Optional<Playlist> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select p from Playlist p left join fetch p.songs where p.user.id = :userId")
    List<Playlist> findAllByUserIdWithEagerRelationships(@Param("userId") Long userId);

    List<Playlist> findAllByUserId(Long userId);

    @Query("select distinct p from Playlist p left join fetch p.songs where p.isPublic = true")
    List<Playlist> findPublicWithEagerRelationships();

    List<Playlist> findPublic();

    @Query("select distinct p from Playlist p left join fetch p.songs where p.isPublic = true OR p.user.id = :userId")
    List<Playlist> findPublicOrUserWithEagerRelationships(@Param("userId") Long userId);

    List<Playlist> findPublicOrUser(Long userId);
}
