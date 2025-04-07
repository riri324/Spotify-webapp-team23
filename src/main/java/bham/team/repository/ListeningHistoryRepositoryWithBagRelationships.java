package bham.team.repository;

import bham.team.domain.ListeningHistory;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface ListeningHistoryRepositoryWithBagRelationships {
    Optional<ListeningHistory> fetchBagRelationships(Optional<ListeningHistory> listeningHistory);

    List<ListeningHistory> fetchBagRelationships(List<ListeningHistory> listeningHistories);

    Page<ListeningHistory> fetchBagRelationships(Page<ListeningHistory> listeningHistories);
}
