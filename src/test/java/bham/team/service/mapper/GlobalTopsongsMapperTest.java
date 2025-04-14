package bham.team.service.mapper;

import static bham.team.domain.GlobalTopsongsAsserts.*;
import static bham.team.domain.GlobalTopsongsTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GlobalTopsongsMapperTest {

    private GlobalTopsongsMapper globalTopsongsMapper;

    @BeforeEach
    void setUp() {
        globalTopsongsMapper = new GlobalTopsongsMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getGlobalTopsongsSample1();
        var actual = globalTopsongsMapper.toEntity(globalTopsongsMapper.toDto(expected));
        assertGlobalTopsongsAllPropertiesEquals(expected, actual);
    }
}
