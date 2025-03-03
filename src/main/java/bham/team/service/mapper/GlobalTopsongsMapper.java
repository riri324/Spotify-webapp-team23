package bham.team.service.mapper;

import bham.team.domain.GlobalTopsongs;
import bham.team.service.dto.GlobalTopsongsDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link GlobalTopsongs} and its DTO {@link GlobalTopsongsDTO}.
 */
@Mapper(componentModel = "spring")
public interface GlobalTopsongsMapper extends EntityMapper<GlobalTopsongsDTO, GlobalTopsongs> {}
