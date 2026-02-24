"use client";

import { useState, useRef, useCallback } from "react";

export function useMeetingRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [sourceName, setSourceName] = useState<string>("Unknown Source");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Stop all browser tracks (Screen + Mic)
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }

            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        }
    }, [isRecording]);

    const startRecording = useCallback(async () => {
        try {
            // 1. Get Screen/Tab Audio (using getDisplayMedia)
            // We need video true to trigger the screen picker, but we only care about audio
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { displaySurface: "browser" },
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                },
            });

            // 2. Get Microphone Audio
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            // Initialize Web Audio API to mix tracks
            const audioContext = new window.AudioContext();
            audioContextRef.current = audioContext;
            const destination = audioContext.createMediaStreamDestination();

            const displayTracks = displayStream.getAudioTracks();
            if (displayTracks.length > 0) {
                const displaySource = audioContext.createMediaStreamSource(new MediaStream([displayTracks[0]]));
                const displayGain = audioContext.createGain();
                displayGain.gain.value = 1.0; // keep tab volume normal
                displaySource.connect(displayGain).connect(destination);
            } else {
                console.warn("No audio track found in display stream. Proceeding with mic only.");
            }

            const micTracks = micStream.getAudioTracks();
            if (micTracks.length > 0) {
                const micSource = audioContext.createMediaStreamSource(new MediaStream([micTracks[0]]));
                const micGain = audioContext.createGain();
                micGain.gain.value = 1.0;
                micSource.connect(micGain).connect(destination);
            }

            // Combine into one stream reference so we can stop them later
            const combinedTracks = [...displayStream.getTracks(), ...micStream.getTracks()];
            const combinedStream = new MediaStream(combinedTracks);
            streamRef.current = combinedStream;

            const videoTracks = displayStream.getVideoTracks();
            if (videoTracks.length > 0 && videoTracks[0].label) {
                // E.g., label might be "Screen 1" or the window title like "YouTube - ..." or "Discord"
                setSourceName(videoTracks[0].label);
            } else {
                setSourceName("Unknown Source");
            }

            // Ensure stop is called when screen sharing stops from browser UI
            displayStream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };

            // 3. Record the mixed audio output
            const mixedStream = destination.stream;

            // Try to find the best supported MIME type
            const mimeType = [
                "audio/webm;codecs=opus",
                "audio/webm",
                "audio/ogg;codecs=opus"
            ].find(type => MediaRecorder.isTypeSupported(type)) || "audio/webm";

            const mediaRecorder = new MediaRecorder(mixedStream, {
                mimeType,
                audioBitsPerSecond: 32000 // 32 kbps is perfect for speech and stays under Vercel 4.5MB limit for ~18-20 mins
            });
            mediaRecorderRef.current = mediaRecorder;


            const chunks: BlobPart[] = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
            };

            mediaRecorder.start(1000); // collect chunks every second
            setIsRecording(true);
            setAudioBlob(null);
            setAudioUrl(null);
        } catch (error) {
            console.error("Error starting recording:", error);
            // Clean up if it fails during setup
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            setIsRecording(false);
        }
    }, [stopRecording]);

    return { isRecording, startRecording, stopRecording, audioBlob, audioUrl, sourceName };
}
