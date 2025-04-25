package bham.team.service.mapper;

import static bham.team.domain.ConcertAsserts.*;
import static bham.team.domain.ConcertTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ConcertMapperTest {

    private ConcertMapper concertMapper;

    @BeforeEach
    void setUp() {
        concertMapper = new ConcertMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getConcertSample1();
        var actual = concertMapper.toEntity(concertMapper.toDto(expected));
        assertConcertAllPropertiesEquals(expected, actual);
    }
}
