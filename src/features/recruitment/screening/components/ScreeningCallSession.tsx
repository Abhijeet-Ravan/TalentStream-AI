'use client';

import type { Candidate, Job } from '../../types';
import {
  DisconnectButton,
  LiveKitRoom,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { CheckCircle2, Loader2, PhoneCall, X } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { completeMockScreening } from '../actions';

type ScreeningCallStatus = 'idle' | 'fetching' | 'calling' | 'done';

type ScreeningCallSessionProps = {
  applicationId: string;
  candidate: Candidate;
  job: Job;
};

export const ScreeningCallSession = (props: ScreeningCallSessionProps) => {
  const [status, setStatus] = useState<ScreeningCallStatus>('idle');
  const [message, setMessage] = useState('');
  const [liveKitUrl, setLiveKitUrl] = useState('');
  const [liveKitToken, setLiveKitToken] = useState('');
  const [isPending, startTransition] = useTransition();
  const hasCompletedRef = useRef(false);

  const skillNames = props.candidate.skills.map(skill => skill.name);

  const buildMockResumeText = () => `
Candidate: ${props.candidate.name}
Email: ${props.candidate.email}
Phone: ${props.candidate.phone}
Current role: ${props.candidate.currentRole}
Current company: ${props.candidate.currentCompany}
Location: ${props.candidate.location}
Experience: ${props.candidate.experienceYears} years
Skills: ${skillNames.join(', ') || 'Not available'}
Expected salary: ${props.candidate.expectedSalary}
Notice period: ${props.candidate.noticePeriod}
Source: ${props.candidate.source}
`;

  const buildScreeningPayload = () => ({
    agent_code: '4d3e09ab-bff2-4d74-8c9e-0fbc792eeed3',
    provider: 'thunderemotionlite',

    // Keep this exactly like Aura for now.
    // Changing this may make Snowie reject or misconfigure the room.
    requested_domains: 'https://demo1.ravan.ai',

    schema_name: '6af30ad4-a50c-4acc-8996-d5f562b6987f',

    // Extra context for our prototype. If Snowie ignores unknown keys, fine.
    // If Snowie rejects unknown keys, remove this `context` object temporarily.
    context: {
      application: {
        id: props.applicationId,
      },

      candidate: {
        id: props.candidate.id,
        name: props.candidate.name,
        email: props.candidate.email,
        phone: props.candidate.phone,
        currentRole: props.candidate.currentRole,
        currentCompany: props.candidate.currentCompany,
        location: props.candidate.location,
        experienceYears: props.candidate.experienceYears,
        skills: skillNames,
        expectedSalary: props.candidate.expectedSalary,
        noticePeriod: props.candidate.noticePeriod,
        source: props.candidate.source,
        resumeText: buildMockResumeText(),
      },

      job: {
        id: props.job.id,
        title: props.job.title,
        department: props.job.department,
        requiredSkills: props.job.requiredSkills,
        preferredSkills: props.job.preferredSkills,
        experienceMin: props.job.experienceMin,
        experienceMax: props.job.experienceMax,
        location: props.job.location,
        employmentType: props.job.employmentType,
      },

      callback_url: '/api/screening/webhook',
    },
  });

  const startCall = async () => {
    setStatus('fetching');
    setMessage('');
    setLiveKitUrl('');
    setLiveKitToken('');
    hasCompletedRef.current = false;

    const payload = buildScreeningPayload();

    try {
      const response = await fetch('https://app.snowie.ai/api/create-room/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Snowie room creation failed: ${response.status}`);
      }

      const data = await response.json();

      const roomUrl = data?.response?.url;
      const token = data?.response?.token;

      if (!roomUrl || !token) {
        throw new Error('Snowie did not return a LiveKit room URL/token.');
      }

      setLiveKitUrl(roomUrl);
      setLiveKitToken(token);
      setStatus('calling');
    } catch (error) {
      console.error('Failed to start AI call:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to start AI call.');
      setStatus('idle');
    }
  };

  const completeCall = () => {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;

    startTransition(async () => {
      try {
        await completeMockScreening(props.applicationId);

        setLiveKitUrl('');
        setLiveKitToken('');
        setStatus('done');
        setMessage('Call completed. Mock transcript and score generated.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Failed to complete call.');
      }
    });
  };

  return (
    <>
      <Button
        disabled={status === 'fetching' || status === 'calling' || isPending}
        onClick={startCall}
        size="sm"
        type="button"
      >
        {status === 'idle' && <PhoneCall className="size-4" />}
        {status === 'fetching' && <Loader2 className="size-4 animate-spin" />}
        {status === 'done' && <CheckCircle2 className="size-4" />}
        {status === 'idle'
          ? 'Start AI Call'
          : status === 'fetching'
            ? 'Preparing...'
            : status === 'calling'
              ? 'In Call'
              : 'Call Done'}
      </Button>

      {message && (
        <span className="text-xs text-muted-foreground">
          {message}
        </span>
      )}

      {status === 'calling' && liveKitUrl && liveKitToken && (
        <div className="
          fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4
        "
        >
          <div className="
            w-full max-w-md rounded-lg border bg-card p-6 shadow-xl
          "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  AI Screening Call
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Live AI screening in progress for
                  {' '}
                  {props.candidate.name}
                  .
                </p>
              </div>

              <button
                className="
                  rounded-md p-1 text-muted-foreground
                  hover:bg-secondary
                "
                onClick={completeCall}
                type="button"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 rounded-lg border bg-secondary p-4">
              <LiveKitRoom
                audio
                connect
                serverUrl={liveKitUrl}
                token={liveKitToken}
                video={false}
                onDisconnected={completeCall}
              >
                <RoomAudioRenderer />

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex size-3">
                      <span
                        className="
                          absolute inline-flex size-full animate-ping
                          rounded-full bg-green-500 opacity-75
                        "
                      />
                      <span
                        className="
                          relative inline-flex size-3 rounded-full bg-green-600
                        "
                      />
                    </span>

                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        LiveKit/Snowie session active
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Connected with a real Snowie LiveKit URL/token.
                      </div>
                    </div>
                  </div>

                  <DisconnectButton
                    className="
                      inline-flex h-9 items-center justify-center gap-2
                      rounded-md bg-destructive px-4 py-2 text-sm font-medium
                      text-white
                      hover:bg-destructive/90
                    "
                  >
                    <PhoneCall className="size-4" />
                    End Call
                  </DisconnectButton>
                </div>
              </LiveKitRoom>
            </div>

            {isPending && (
              <p className="mt-4 text-xs text-muted-foreground">
                Completing screening and generating mock result...
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
