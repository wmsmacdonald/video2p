function testTypes(types) {
            for (var i = 0; i < types.length; ++i)
                console.log("MediaSource.isTypeSupported(" + types[i] + ") : " + MediaSource.isTypeSupported(types[i]));
        }
        function onLoad() {
            console.log("Testing valid type strings.");
            var validTypes = [
                
                //[mime type; codecs]                            // [format],[video codec],[audio codec]
                'video/ogg',                                     // ogg, theora, Vorbis
                'video/ogg; codecs="theora, vorbis"',            // ogg, theora, Vorbis
                'video/webm',                                    // WebM, VP8, Vorbis
                'video/webm; codecs="vp8"',                      // WebM, VP8, Vorbis
                'video/webm; codecs="vorbis"',                   // WebM, VP8, Vorbis
                'video/webm; codecs="vp8, vorbis"',              // WebM, VP8, Vorbis
                //'video/webm',                                  // WebM, VP9, Vorbis
                'video/webm; codecs="vp9, vorbis"',              // WebM, VP9, Vorbis
                'audio/webm; codecs="vorbis"',                   // WebM,  - , Vorbis
                'video/mp4',                                     // MPEG4, AVC, aac
                'video/mp4; codecs="avc1.66.13,  mp4a.40.2"',    // MPEG4, AVC(H.264) Baseline 1.3, AAC-LC, [MPEG-4 AVC/H.264]
                'video/mp4; codecs="avc1.42e01e, mp4a.40.2"',    // MPEG4, AVC(H.264) Baseline 1.3, AAC-LC, [MPEG-4 AVC/H.264]
                'video/mp4; codecs="avc1.66.30,  mp4a.40.5"',    // MPEG4, AVC(H.264) Baseline 3.0, AAC-HC, [MPEG-4 AVC/H.264]
                'video/mp4; codecs="avc1.42001e, mp4a.40.5"',    // MPEG4, AVC(H.264) Baseline 3.0, AAC-HC, [MPEG-4 AVC/H.264]
                'video/mp4; codecs="avc1.42001f, mp4a.40.5"',    // MPEG4, AVC(H.264) Baseline 3.1, AAC-HC, [MPEG-4 AVC/H.264]
                'video/mp4; codecs="avc1.77.30,  mp4a.40.5"',    // MPEG4, AVC(H.264) Main 3.0, AAC-HC,     [MPEG-4 AVC/H.264]
                'video/mp4; codecs="avc1.4d001e, mp4a.40.5"',    // MPEG4, AVC(H.264) Main 3.0, AAC-HC,     [MPEG-4 AVC/H.264]
                'video/mp4; codecs="avc1.4d001f, mp4a.40.5"',    // MPEG4, AVC(H.264) Main 3.1, AAC-HC,     [MPEG-4 AVC/H.264]
                'video/mp4; codecs="avc1.640029, mp4a.40.5"',    // MPEG4, AVC(H.264) High 4.1, AAC-HC,     [MPEG-4 AVC/H.264]
                'audio/mp4; codecs="mp4a.40.2"',                 // MPEG4 AAC-LC
                'audio/mp4; codecs="mp4a.40.5"',                 // MPEG4 HE-AAC
                'audio/mp4; codecs="mp4a.67"',                   // MPEG2 AAC-LC
                'video/mp4; codecs="mp4a.40.2"',
                'video/mp4; codecs="avc1.4d001e, mp4a.40.2"',    // MPEG4 AVC(H.264) Main 3.0, AAC-LC
                'video/x-m4v',                                   // m4v,
                'video/quicktime',                               // mov,
                'video/mp4; codecs="mp4v.20.8, mp4a.40.3"',      // mp4, mpeg4 visual, mp3
                'video/mp4; codecs="mp4v.20.8, samr"',           // mp4(3gp), mpeg4 visual, amr
                'application/x-mpegurl',                         // HLS, AVC, AAC
                'application/vnd.apple.mpegurl',                 // HLS, AVC, AAC
                'application/vnd.ms-ss',                         // SmoothStreaming
                'application/vnd.ms-sstr+xml',                   // SmoothStreaming
            ];
            
            testTypes(validTypes);
        }

onLoad();
