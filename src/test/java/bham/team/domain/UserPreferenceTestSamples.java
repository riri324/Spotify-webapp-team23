package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class UserPreferenceTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static UserPreference getUserPreferenceSample1() {
        return new UserPreference()
            .id(1L)
            .favoriteGenre("favoriteGenre1")
            .musicPurpose("musicPurpose1")
            .musicMood("musicMood1")
            .vocalPreference("vocalPreference1")
            .listeningTime("listeningTime1")
            .listeningPattern("listeningPattern1")
            .songLength("songLength1")
            .lyricsImportance("lyricsImportance1");
    }

    public static UserPreference getUserPreferenceSample2() {
        return new UserPreference()
            .id(2L)
            .favoriteGenre("favoriteGenre2")
            .musicPurpose("musicPurpose2")
            .musicMood("musicMood2")
            .vocalPreference("vocalPreference2")
            .listeningTime("listeningTime2")
            .listeningPattern("listeningPattern2")
            .songLength("songLength2")
            .lyricsImportance("lyricsImportance2");
    }

    public static UserPreference getUserPreferenceRandomSampleGenerator() {
        return new UserPreference()
            .id(longCount.incrementAndGet())
            .favoriteGenre(UUID.randomUUID().toString())
            .musicPurpose(UUID.randomUUID().toString())
            .musicMood(UUID.randomUUID().toString())
            .vocalPreference(UUID.randomUUID().toString())
            .listeningTime(UUID.randomUUID().toString())
            .listeningPattern(UUID.randomUUID().toString())
            .songLength(UUID.randomUUID().toString())
            .lyricsImportance(UUID.randomUUID().toString());
    }
}
