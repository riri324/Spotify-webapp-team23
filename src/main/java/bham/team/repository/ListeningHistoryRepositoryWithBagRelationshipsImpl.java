package bham.team.repository;

import bham.team.domain.ListeningHistory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ListeningHistoryRepositoryWithBagRelationshipsImpl implements ListeningHistoryRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String LISTENINGHISTORIES_PARAMETER = "listeningHistories";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<ListeningHistory> fetchBagRelationships(Optional<ListeningHistory> listeningHistory) {
        return listeningHistory.map(this::fetchSongs);
    }

    @Override
    public Page<ListeningHistory> fetchBagRelationships(Page<ListeningHistory> listeningHistories) {
        return new PageImpl<>(
            fetchBagRelationships(listeningHistories.getContent()),
            listeningHistories.getPageable(),
            listeningHistories.getTotalElements()
        );
    }

    @Override
    public List<ListeningHistory> fetchBagRelationships(List<ListeningHistory> listeningHistories) {
        return Optional.of(listeningHistories).map(this::fetchSongs).orElse(Collections.emptyList());
    }

    ListeningHistory fetchSongs(ListeningHistory result) {
        return entityManager
            .createQuery(
                "select listeningHistory from ListeningHistory listeningHistory left join fetch listeningHistory.songs where listeningHistory.id = :id",
                ListeningHistory.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<ListeningHistory> fetchSongs(List<ListeningHistory> listeningHistories) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, listeningHistories.size()).forEach(index -> order.put(listeningHistories.get(index).getId(), index));
        List<ListeningHistory> result = entityManager
            .createQuery(
                "select listeningHistory from ListeningHistory listeningHistory left join fetch listeningHistory.songs where listeningHistory in :listeningHistories",
                ListeningHistory.class
            )
            .setParameter(LISTENINGHISTORIES_PARAMETER, listeningHistories)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
