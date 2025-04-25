package bham.team.service.mapper;

import static bham.team.domain.RecommendAsserts.*;
import static bham.team.domain.RecommendTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RecommendMapperTest {

    private RecommendMapper recommendMapper;

    @BeforeEach
    void setUp() {
        recommendMapper = new RecommendMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getRecommendSample1();
        var actual = recommendMapper.toEntity(recommendMapper.toDto(expected));
        assertRecommendAllPropertiesEquals(expected, actual);
    }
}
