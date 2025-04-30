import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  IconButton,
  ListItemText,
  ListItemIcon,
  Modal,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Backdrop,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import axios from 'axios';
import { keyframes } from '@mui/system';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import RadioIcon from '@mui/icons-material/Radio';
import CreateIcon from '@mui/icons-material/Create';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import WavesIcon from '@mui/icons-material/Waves';

// Add new animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const typewriterDots = keyframes`
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60% { content: '...'; }
  80% { content: '....'; }
  100% { content: '.....'; }
`;

const scriptGeneration = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-15px) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
`;

const radioWaves = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(124, 58, 237, 0);
    transform: scale(1.1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
    transform: scale(1);
  }
`;

const glowPulse = keyframes`
  0% {
    filter: brightness(1) drop-shadow(0 0 0px rgba(124, 58, 237, 0.7));
  }
  50% {
    filter: brightness(1.3) drop-shadow(0 0 10px rgba(124, 58, 237, 0.9));
  }
  100% {
    filter: brightness(1) drop-shadow(0 0 0px rgba(124, 58, 237, 0.7));
  }
`;

const penMovement = keyframes`
  0% {
    transform: translate(-10px, -10px) rotate(-45deg);
  }
  50% {
    transform: translate(10px, 10px) rotate(-45deg);
  }
  100% {
    transform: translate(-10px, -10px) rotate(-45deg);
  }
`;

const paperFloat = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(1deg);
  }
  75% {
    transform: translateY(5px) rotate(-1deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
`;

const inkAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
`;

const waveform = keyframes`
  0% {
    height: 10px;
  }
  50% {
    height: 40px;
  }
  100% {
    height: 10px;
  }
`;

// Create dark theme with sophisticated color palette
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED', // Deep purple
      light: '#9F67FF',
      dark: '#5B21B6',
    },
    secondary: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#0F172A', // Slate 900
      paper: '#1E293B', // Slate 800
    },
    text: {
      primary: '#F1F5F9', // Slate 100
      secondary: '#94A3B8', // Slate 400
    },
    divider: 'rgba(148, 163, 184, 0.08)', // Slate 400 with low opacity
    custom: {
      accent1: '#F43F5E', // Rose 500
      accent2: '#3B82F6', // Blue 500
      cardBg: '#1E293B', // Slate 800
      hoveredCardBg: '#334155', // Slate 700
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        },
      },
    },
  },
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  p: 4,
};

// Enhanced background with subtle gradient and pattern
const DynamicBackground = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: `linear-gradient(120deg, ${darkTheme.palette.background.default} 0%, #162544 100%)`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.15) 2%, transparent 0%), 
          radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.15) 2%, transparent 0%)`,
        backgroundSize: '100px 100px',
        opacity: 0.4,
      },
    }}
  />
);

function App() {
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [numGuests, setNumGuests] = useState(1);
  const [voices, setVoices] = useState({});
  const [hostVoice, setHostVoice] = useState('Adam');
  const [guestVoices, setGuestVoices] = useState(['Alice']);
  const [playingSample, setPlayingSample] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [audioName, setAudioName] = useState('');
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);

  useEffect(() => {
    // Fetch available voices when component mounts
    const fetchVoices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-voices`);
        setVoices(response.data);
      } catch (err) {
        console.error('Error fetching voices:', err);
      }
    };
    fetchVoices();
  }, []);

  // Update guest voices when number of guests changes
  useEffect(() => {
    if (numGuests > guestVoices.length) {
      // Add new guest voices
      setGuestVoices([...guestVoices, ...Array(numGuests - guestVoices.length).fill('Alice')]);
    } else if (numGuests < guestVoices.length) {
      // Remove extra guest voices
      setGuestVoices(guestVoices.slice(0, numGuests));
    }
  }, [numGuests]);

  const handleGuestVoiceChange = (index, value) => {
    const newGuestVoices = [...guestVoices];
    newGuestVoices[index] = value;
    setGuestVoices(newGuestVoices);
  };

  const playVoiceSample = (voiceName) => {
    if (playingSample) {
      playingSample.pause();
      playingSample.currentTime = 0;
    }
    const audio = new Audio(`${process.env.REACT_APP_API_BASE_URL}/voice-sample/${voices[voiceName].sample_path.split('/').pop()}`);
    audio.onended = () => setPlayingSample(null);
    audio.play();
    setPlayingSample(audio);
  };

  const handleGenerateScript = async () => {
    try {
      setLoading(true);
      setError('');
      setModalOpen(true);
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/generate-script`, {
        prompt,
        numGuests,
        hostVoice,
        guestVoices
      });
      setScript(response.data.script);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(`Error generating script: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePodcast = async () => {
    try {
      setLoading(true);
      setError('');
      setModalOpen(false);
      setIsGeneratingPodcast(true);
      
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/create-podcast`, {
        script,
        hostVoice,
        guestVoices
      }, {
        responseType: 'blob'
      });
      
      const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      
      const promptName = prompt.split('\n')[0].slice(0, 30).trim().replace(/[^a-zA-Z0-9]/g, '_');
      const newAudioName = `${promptName}.mp3`;
      setAudioName(newAudioName);
    } catch (err) {
      let errorMessage = 'Error creating podcast';
      if (err.response?.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            setError(`Error creating podcast: ${errorData.error}`);
          } catch (e) {
            setError(`Error creating podcast: ${err.message}`);
          }
        };
        reader.readAsText(err.response.data);
      } else {
        setError(`Error creating podcast: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setIsGeneratingPodcast(false);
      setScript('');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = audioName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePlayInMenu = (event, voiceName) => {
    event.stopPropagation(); // Prevent the menu from closing
    playVoiceSample(voiceName);
  };

  const handleScriptRevision = async () => {
    try {
      setLoading(true);
      setError('');
      setScript(''); // Clear the script to show animation
      setRevisionModalOpen(false);
      
      const revisedPrompt = revisionNote.trim() 
        ? `${prompt}\n\nPlease revise the script with these changes: ${revisionNote}`
        : prompt;
      
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/generate-script`, {
        prompt: revisedPrompt,
        numGuests,
        hostVoice,
        guestVoices
      });
      setScript(response.data.script);
      setRevisionNote('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(`Error generating script: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Loading animation components
  const ScriptGenerationAnimation = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 3,
        my: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: 200,
          height: 200,
        }}
      >
        {/* Paper Background */}
        <Box
          sx={{
            position: 'absolute',
            width: 120,
            height: 160,
            backgroundColor: '#f8f9fa',
            borderRadius: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            animation: `${paperFloat} 3s ease-in-out infinite`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 20,
              left: 20,
              right: 20,
              height: 2,
              backgroundColor: '#e9ecef',
              boxShadow: `
                0 20px 0 #e9ecef,
                0 40px 0 #e9ecef,
                0 60px 0 #e9ecef,
                0 80px 0 #e9ecef
              `
            }
          }}
        />

        {/* Animated Pen */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `${penMovement} 2s ease-in-out infinite`,
            zIndex: 2,
          }}
        >
          <CreateIcon 
            sx={{ 
              fontSize: 40,
              color: 'primary.main',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            }}
          />
        </Box>

        {/* Ink Effect */}
        <Box
          sx={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: `${inkAnimation} 2s ease-in-out infinite`,
            top: '60%',
            left: '60%',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: 'primary.light',
              animation: `${inkAnimation} 2s ease-in-out infinite 0.5s`,
              top: -10,
              left: 5,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: 'primary.dark',
              animation: `${inkAnimation} 2s ease-in-out infinite 1s`,
              top: 5,
              left: -8,
            }
          }}
        />

        {/* Existing Ripple Effect */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.main',
              animation: `${radioWaves} 2s ease-out infinite`,
            }
          }}
        />
      </Box>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            display: 'inline-block',
            animation: `${typewriterDots} 2s steps(5) infinite`,
          }
        }}
      >
        Crafting your script
      </Typography>
    </Box>
  );

  const PodcastCreationAnimation = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 3,
        my: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <RadioIcon 
          sx={{ 
            fontSize: 60,
            color: 'secondary.main',
            animation: `${glowPulse} 2s ease-in-out infinite`,
          }} 
        />
        <Box
          sx={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'secondary.main',
            opacity: 0.2,
            animation: `${radioWaves} 1.5s ease-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'secondary.main',
            opacity: 0.1,
            animation: `${radioWaves} 1.5s ease-out infinite 0.5s`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'secondary.main',
            opacity: 0.05,
            animation: `${radioWaves} 1.5s ease-out infinite 1s`,
          }}
        />
      </Box>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            display: 'inline-block',
            animation: `${typewriterDots} 2s steps(5) infinite`,
          }
        }}
      >
        Creating your podcast
      </Typography>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DynamicBackground />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            fontSize: modalOpen ? '2rem' : '4rem',
            fontWeight: 700,
            color: 'text.primary',
            mb: 4,
            transition: 'all 0.3s ease-in-out',
            position: 'relative',
            animation: `${fadeIn} 1s ease-out`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '80px',
              background: `linear-gradient(135deg, ${darkTheme.palette.primary.main} 0%, ${darkTheme.palette.secondary.main} 100%)`,
              opacity: 0.1,
              borderRadius: '50%',
              zIndex: -1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: modalOpen ? 40 : 80,
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${darkTheme.palette.primary.main}, ${darkTheme.palette.secondary.main})`,
              transition: 'all 0.3s ease-in-out',
            }
          }}
        >
          VoiceVerse AI
        </Typography>

        <Card 
          elevation={0}
          sx={{ 
            backgroundColor: 'background.paper',
            p: 3,
            mb: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Enter your podcast topic"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.default',
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateScript}
            disabled={loading || !prompt}
            fullWidth
            size="large"
            sx={{ 
              py: 2,
              background: `linear-gradient(45deg, ${darkTheme.palette.primary.main}, ${darkTheme.palette.primary.light})`,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
                background: `linear-gradient(45deg, ${darkTheme.palette.primary.dark}, ${darkTheme.palette.primary.main})`,
              }
            }}
          >
            Generate Podcast
          </Button>
        </Card>

        <Modal
          open={modalOpen}
          onClose={() => !loading && setModalOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { 
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease-in-out',
            }
          }}
        >
          <Fade in={modalOpen}>
            <Box sx={{
              ...modalStyle,
              animation: `${fadeIn} 0.5s ease-out`
            }}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                Create Your Podcast
              </Typography>

              <Accordion 
                sx={{ 
                  mt: 2,
                  backgroundColor: 'background.default',
                  borderRadius: '8px !important',
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: '16px 0',
                  }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-expanded': {
                      minHeight: 48,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon sx={{ color: 'text.secondary' }} />
                    <Typography color="text.primary" sx={{ fontWeight: 500 }}>Advanced Settings</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Number of Guests</InputLabel>
                        <Select
                          value={numGuests}
                          label="Number of Guests"
                          onChange={(e) => setNumGuests(e.target.value)}
                        >
                          <MenuItem value={1}>1 Guest</MenuItem>
                          <MenuItem value={2}>2 Guests</MenuItem>
                          <MenuItem value={3}>3 Guests</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <FormControl fullWidth>
                        <InputLabel>Host Voice</InputLabel>
                        <Select
                          value={hostVoice}
                          label="Host Voice"
                          onChange={(e) => setHostVoice(e.target.value)}
                        >
                          {Object.keys(voices).map((voice) => (
                            <MenuItem key={voice} value={voice}>
                              <ListItemIcon>
                                <IconButton 
                                  size="small"
                                  onClick={(e) => handlePlayInMenu(e, voice)}
                                >
                                  <PlayArrowIcon fontSize="small" />
                                </IconButton>
                              </ListItemIcon>
                              <ListItemText primary={voice} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {guestVoices.map((voice, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <FormControl fullWidth>
                          <InputLabel>Guest {index + 1} Voice</InputLabel>
                          <Select
                            value={voice}
                            label={`Guest ${index + 1} Voice`}
                            onChange={(e) => handleGuestVoiceChange(index, e.target.value)}
                          >
                            {Object.keys(voices).map((voiceName) => (
                              <MenuItem key={voiceName} value={voiceName}>
                                <ListItemIcon>
                                  <IconButton 
                                    size="small"
                                    onClick={(e) => handlePlayInMenu(e, voiceName)}
                                  >
                                    <PlayArrowIcon fontSize="small" />
                                  </IconButton>
                                </ListItemIcon>
                                <ListItemText primary={voiceName} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 3, borderTop: '1px solid', borderColor: 'divider', pt: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleScriptRevision}
                      disabled={loading}
                      sx={{ 
                        py: 1.5,
                        background: `linear-gradient(45deg, ${darkTheme.palette.primary.main}, ${darkTheme.palette.primary.light})`,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          background: `linear-gradient(45deg, ${darkTheme.palette.primary.dark}, ${darkTheme.palette.primary.main})`,
                        }
                      }}
                    >
                      Generate New Script
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {script && (
                <Box sx={{ mt: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    Generated Script
                  </Typography>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      mb: 3, 
                      p: 2,
                      backgroundColor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        color: 'text.primary',
                        lineHeight: 1.7,
                      }}
                    >
                      {script}
                    </Typography>
                  </Card>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setRevisionModalOpen(true)}
                        fullWidth
                        size="large"
                        startIcon={<CloseIcon />}
                        sx={{ 
                          py: 2,
                          backgroundColor: 'error.main',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            backgroundColor: 'error.dark',
                          }
                        }}
                      >
                        Reject & Revise
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleCreatePodcast}
                        disabled={loading}
                        fullWidth
                        size="large"
                        startIcon={<CheckIcon />}
                        sx={{ 
                          py: 2,
                          background: `linear-gradient(45deg, ${darkTheme.palette.secondary.main}, ${darkTheme.palette.secondary.light})`,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            background: `linear-gradient(45deg, ${darkTheme.palette.secondary.dark}, ${darkTheme.palette.secondary.main})`,
                          }
                        }}
                      >
                        Accept & Create
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {loading && (
                <>
                  {script === 'generating_podcast' ? <PodcastCreationAnimation /> : <ScriptGenerationAnimation />}
                </>
              )}

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 3,
                    backgroundColor: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                  }}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Fade>
        </Modal>

        {/* Revision Modal */}
        <Modal
          open={revisionModalOpen}
          onClose={() => !loading && setRevisionModalOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { 
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease-in-out',
            }
          }}
        >
          <Fade in={revisionModalOpen}>
            <Box sx={{
              ...modalStyle,
              animation: `${fadeIn} 0.5s ease-out`,
              width: '90%',
              maxWidth: 600,
            }}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                Request Script Revision
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="What would you like to change? (Optional)"
                placeholder="Enter your revision requests here..."
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.default',
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
                }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setRevisionModalOpen(false)}
                    sx={{ py: 1.5 }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleScriptRevision}
                    disabled={loading}
                    sx={{ 
                      py: 1.5,
                      background: `linear-gradient(45deg, ${darkTheme.palette.primary.main}, ${darkTheme.palette.primary.light})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${darkTheme.palette.primary.dark}, ${darkTheme.palette.primary.main})`,
                      }
                    }}
                  >
                    Generate New Script
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Modal>

        {/* Full-screen podcast generation overlay */}
        {isGeneratingPodcast && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: `${fadeIn} 0.3s ease-out`,
            }}
          >
            <PodcastCreationAnimation />
          </Box>
        )}

        {audioUrl && (
          <Card 
            elevation={0}
            sx={{ 
              mt: 3,
              backgroundColor: 'background.paper',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              animation: `${fadeIn} 0.5s ease-out`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.2)',
              }
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Header Section */}
              <Box 
                sx={{ 
                  p: 3,
                  background: `linear-gradient(45deg, ${darkTheme.palette.background.paper} 0%, ${darkTheme.palette.primary.dark} 300%)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.1,
                    overflow: 'hidden',
                  }}
                >
                  {[...Array(8)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: '3px',
                        height: '20px',
                        backgroundColor: 'primary.main',
                        animation: `${waveform} ${1 + (i * 0.2)}s ease-in-out infinite`,
                      }}
                    />
                  ))}
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MusicNoteIcon sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'text.primary',
                          fontWeight: 600,
                        }}
                      >
                        {audioName}
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <WavesIcon sx={{ fontSize: 16 }} />
                        AI Generated Podcast
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    onClick={handleDownload}
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      backdropFilter: 'blur(4px)',
                      backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      '&:hover': {
                        borderColor: 'primary.light',
                        backgroundColor: 'rgba(124, 58, 237, 0.2)',
                      }
                    }}
                  >
                    Download
                  </Button>
                </Box>
              </Box>

              {/* Audio Player Section */}
              <Box 
                sx={{ 
                  p: 3,
                  backgroundColor: 'background.default',
                }}
              >
                <Box 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    '& audio': {
                      width: '100%',
                      height: '40px',
                      '&::-webkit-media-controls-panel': {
                        backgroundColor: 'transparent',
                      },
                      '&::-webkit-media-controls-play-button': {
                        backgroundColor: darkTheme.palette.primary.main,
                        borderRadius: '50%',
                      },
                      '&::-webkit-media-controls-current-time-display': {
                        color: darkTheme.palette.text.primary,
                      },
                      '&::-webkit-media-controls-time-remaining-display': {
                        color: darkTheme.palette.text.primary,
                      },
                    }
                  }}
                >
                  <audio 
                    controls 
                    src={audioUrl}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;