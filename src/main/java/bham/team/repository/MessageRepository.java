package bham.team.repository;

import bham.team.domain.Message;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Message entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("select message from Message message where message.sender.login = ?#{authentication.name}")
    List<Message> findBySenderIsCurrentUser();

    @Query("select message from Message message where message.recipient.login = ?#{authentication.name}")
    List<Message> findByRecipientIsCurrentUser();
}
