package bham.team.service.mapper;

import bham.team.domain.Concert;
import bham.team.service.dto.ConcertDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Concert} and its DTO {@link ConcertDTO}.
 */
@Mapper(componentModel = "spring")
public interface ConcertMapper extends EntityMapper<ConcertDTO, Concert> {}
