package bham.team.service.mapper;

import bham.team.domain.Recommend;
import bham.team.service.dto.RecommendDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Recommend} and its DTO {@link RecommendDTO}.
 */
@Mapper(componentModel = "spring")
public interface RecommendMapper extends EntityMapper<RecommendDTO, Recommend> {}
