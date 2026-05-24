'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Search,
  MessageSquare,
  Briefcase,
  Battery,
  Wifi,
  Signal,
  Calendar,
  Clock3,
} from 'lucide-react';

export default function PhoneMockup() {
  const { scrollYProgress } = useScroll();
  const rotateY = useTransform(scrollYProgress, [0, 0.5], [8, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [-5, 0]);

  const mockTasks = [
    {
      title: 'Google OA',
      subtitle: 'Online Assessment',
      date: 'Today, 5:00 PM',
      urgency: 'High',
      color: '#EF4444',
      bg: '#FEF2F2',
    },
    {
      title: 'React Assessment',
      subtitle: 'Frontend Interview',
      date: 'Tomorrow, 10:00 AM',
      urgency: 'Medium',
      color: '#F59E0B',
      bg: '#FFFBEB',
    },
    {
      title: 'Submit Assignment',
      subtitle: 'DSA Assignment',
      date: 'Friday, 11:59 PM',
      urgency: 'Low',
      color: '#10B981',
      bg: '#F0FDF4',
    },
    {
      title: 'Team Standup',
      subtitle: 'Project Sync',
      date: 'Monday, 9:00 AM',
      urgency: 'Low',
      color: '#6366F1',
      bg: '#EEF2FF',
    },
    {
      title: 'HackFest Final',
      subtitle: 'Hackathon Submission',
      date: 'Sat, 6:00 PM',
      urgency: 'High',
      color: '#EF4444',
      bg: '#FEF2F2',
    },
  ];

  return (
    // Outer wrapper with perspective for 3D effect
    <motion.div
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
        width: '320px',
        height: '650px',
        flexShrink: 0,
        // Extra shadow on the parent to cast the phone onto the background
        filter:
          'drop-shadow(0 60px 40px rgba(0,0,0,0.18)) drop-shadow(0 20px 15px rgba(0,0,0,0.10))',
        rotateY,
        rotateX,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          // Titanium-like metallic border with rim lighting
          border: '10px solid transparent',
          backgroundClip: 'padding-box',
          backgroundImage: 'linear-gradient(#fff, #fff)',
          // Layered box-shadows for bezel depth and ambient lighting
          boxShadow: `
          0 0 0 1px rgba(0,0,0,0.15),
          0 0 0 2px rgba(200,200,200,0.8),
          0 0 0 3px rgba(150,150,150,0.6),
          0 0 0 4px rgba(80,80,80,0.5),
          0 0 0 11px #1a1a1a,
          0 0 0 12px rgba(255,255,255,0.08),
          inset 0 2px 8px rgba(255,255,255,0.5),
          inset 0 -2px 8px rgba(0,0,0,0.3)
        `,
          overflow: 'hidden',
        }}
      >
        {/* === GLASS REFLECTION OVERLAY === */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(
            135deg,
            rgba(255,255,255,0.25) 0%,
            rgba(255,255,255,0.05) 30%,
            rgba(255,255,255,0) 50%,
            rgba(255,255,255,0.03) 100%
          )`,
            zIndex: 50,
            pointerEvents: 'none',
            borderRadius: '40px',
          }}
        />

        {/* === STATUS BAR === */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '44px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            zIndex: 40,
            fontSize: '13px',
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.3px',
            background: 'rgba(250,250,250,0.95)',
          }}
        >
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
          <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
            <Signal size={13} strokeWidth={2.5} />
            <Wifi size={13} strokeWidth={2.5} />
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Battery size={18} strokeWidth={2.5} />
              <div
                style={{
                  position: 'absolute',
                  left: '3px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '9px',
                  height: '9px',
                  background: '#0f172a',
                  borderRadius: '1px',
                }}
              />
            </div>
          </div>
        </div>

        {/* === DYNAMIC ISLAND === */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '110px',
            height: '32px',
            backgroundColor: '#000',
            borderRadius: '20px',
            zIndex: 45,
            boxShadow:
              '0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Front camera & sensor dots */}
          <div
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #1a3a5c, #000)',
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.08)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '30px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
            }}
          />
        </div>

        {/* === SIDE BUTTONS (left: volume + mute) === */}
        {/* Mute switch */}
        <div
          style={{
            position: 'absolute',
            left: '-12px',
            top: '100px',
            width: '4px',
            height: '24px',
            background: 'linear-gradient(to right, #888, #ccc, #aaa)',
            borderRadius: '3px 0 0 3px',
            boxShadow: '-1px 0 3px rgba(0,0,0,0.3)',
          }}
        />
        {/* Vol up */}
        <div
          style={{
            position: 'absolute',
            left: '-12px',
            top: '148px',
            width: '4px',
            height: '44px',
            background: 'linear-gradient(to right, #888, #ccc, #aaa)',
            borderRadius: '3px 0 0 3px',
            boxShadow: '-1px 0 3px rgba(0,0,0,0.3)',
          }}
        />
        {/* Vol down */}
        <div
          style={{
            position: 'absolute',
            left: '-12px',
            top: '208px',
            width: '4px',
            height: '44px',
            background: 'linear-gradient(to right, #888, #ccc, #aaa)',
            borderRadius: '3px 0 0 3px',
            boxShadow: '-1px 0 3px rgba(0,0,0,0.3)',
          }}
        />
        {/* Power button (right) */}
        <div
          style={{
            position: 'absolute',
            right: '-12px',
            top: '160px',
            width: '4px',
            height: '64px',
            background: 'linear-gradient(to left, #888, #ccc, #aaa)',
            borderRadius: '0 3px 3px 0',
            boxShadow: '1px 0 3px rgba(0,0,0,0.3)',
          }}
        />

        {/* === SCROLLABLE CONTENT === */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            paddingTop: '60px',
            paddingBottom: '90px',
            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          }}
        >
          {/* Greeting header */}
          <div
            style={{
              padding: '20px 20px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p
                style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}
              >
                Good morning
              </p>
              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.2,
                }}
              >
                Your Tasks
              </h3>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 800,
              }}
            >
              U
            </div>
          </div>

          {/* Search bar */}
          <div style={{ padding: '0 20px 16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#fff',
                borderRadius: '16px',
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <Search size={16} color="#94a3b8" />
              <span
                style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}
              >
                Search tasks...
              </span>
            </div>
          </div>

          {/* Category pills */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              padding: '0 20px 20px',
            }}
          >
            {['All', 'Coding', 'Interviews', 'Exams'].map((cat, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 18px',
                  borderRadius: '24px',
                  whiteSpace: 'nowrap',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: i === 0 ? '#0f172a' : '#fff',
                  color: i === 0 ? '#fff' : '#64748b',
                  boxShadow:
                    i === 0
                      ? '0 4px 10px rgba(0,0,0,0.15)'
                      : '0 1px 4px rgba(0,0,0,0.04)',
                  border: i !== 0 ? '1px solid #e2e8f0' : 'none',
                  flexShrink: 0,
                }}
              >
                {cat}
              </div>
            ))}
          </div>

          {/* Task cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '0 20px',
            }}
          >
            {mockTasks.map((task, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Left accent strip */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: task.color,
                    borderRadius: '4px 0 0 4px',
                  }}
                />

                <div
                  style={{
                    paddingLeft: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#0f172a',
                        letterSpacing: '-0.3px',
                        margin: 0,
                      }}
                    >
                      {task.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        margin: '2px 0 0',
                      }}
                    >
                      {task.subtitle}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '10px',
                      color: task.color,
                      background: task.bg,
                      flexShrink: 0,
                      marginLeft: '8px',
                    }}
                  >
                    {task.urgency}
                  </span>
                </div>

                <div
                  style={{
                    paddingLeft: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Clock3 size={12} color={task.color} />
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: 600,
                    }}
                  >
                    {task.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === FROSTED BOTTOM NAV === */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '88px',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderTop: '0.5px solid rgba(0,0,0,0.06)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: '24px',
            zIndex: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: '#0f172a',
            }}
          >
            <div
              style={{
                background: '#f1f5f9',
                padding: '8px',
                borderRadius: '14px',
              }}
            >
              <Briefcase size={18} strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.3px',
              }}
            >
              Tasks
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: '#94a3b8',
            }}
          >
            <div style={{ padding: '8px', borderRadius: '14px' }}>
              <Calendar size={18} strokeWidth={2} />
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.3px',
              }}
            >
              Calendar
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: '#94a3b8',
            }}
          >
            <div style={{ padding: '8px', borderRadius: '14px' }}>
              <MessageSquare size={18} strokeWidth={2} />
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.3px',
              }}
            >
              Chat
            </span>
          </div>
        </div>

        {/* === HOME INDICATOR === */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '130px',
            height: '5px',
            background: '#0f172a',
            borderRadius: '5px',
            zIndex: 50,
            opacity: 0.8,
          }}
        />
      </div>
    </motion.div>
  );
}
