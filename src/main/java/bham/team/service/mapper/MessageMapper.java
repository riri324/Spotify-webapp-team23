package bham.team.service.mapper;

import bham.team.domain.Message;
import bham.team.domain.User;
import bham.team.service.dto.MessageDTO;
import bham.team.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Message} and its DTO {@link MessageDTO}.
 */
@Mapper(componentModel = "spring")
public interface MessageMapper extends EntityMapper<MessageDTO, Message> {
    @Mapping(target = "sender", source = "sender", qualifiedByName = "userId")
    @Mapping(target = "recipient", source = "recipient", qualifiedByName = "userId")
    MessageDTO toDto(Message s);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
