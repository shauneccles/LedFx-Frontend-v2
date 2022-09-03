/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import {
  Stack,
  CircularProgress as CircularProgress5,
  Fab,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Chat,
  Check,
  DeleteForever,
  GitHub,
  PauseOutlined,
  PlayArrow,
} from '@material-ui/icons';
import green from '@material-ui/core/colors/green';
import { Dvr } from '@mui/icons-material';
import useStore from '../../store/useStore';
import { deleteFrontendConfig } from '../../utils/helpers';
import Gauge from './Gauge';
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon';
import Popover from '../../components/Popover/Popover';
import TourHome from '../../components/Tours/TourHome';
import SmartBar from '../../components/Dialogs/SmartBar';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const scanForDevices = useStore((state) => state.scanForDevices);
  const devices = useStore((state) => state.devices);
  const virtuals = useStore((state) => state.virtuals);
  const scenes = useStore((state) => state.scenes);
  const integrations = useStore((state) => state.integrations);
  const paused = useStore((state) => state.paused);
  const togglePause = useStore((state) => state.togglePause);
  const config = useStore((state) => state.config);
  const getDevices = useStore((state) => state.getDevices);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getScenes = useStore((state) => state.getScenes);
  const [scanning, setScanning] = useState(-1);
  const setSmartBarOpen = useStore(
    (state) => state.ui.bars && state.ui.setSmartBarOpen
  );
  const pixelTotal = Object.keys(devices)
    .map((d) => devices[d].config.pixel_count)
    .reduce((a, b) => a + b);

  const devicesOnline = Object.keys(devices).filter((d) => devices[d].online);
  const virtualsReal = Object.keys(virtuals).filter(
    (d) => !virtuals[d].is_device
  );

  const pixelTotalOnline = Object.keys(devices)
    .map((d) => devices[d].online && devices[d].config.pixel_count)
    .reduce((a, b) => a + b);

  const handleScan = () => {
    setScanning(0);
    scanForDevices()
      .then(async () => {
        for (let sec = 1; sec <= 30; sec++) {
          await sleep(1000).then(() => {
            getDevices();
            getVirtuals();
            setScanning(sec);
          });
        }
      })
      .then(() => {
        setScanning(-1);
      });
  };

  useEffect(() => {
    getScenes();
  }, []);

  // console.log(
  //   Object.values(config.ledfx_presets)
  //     .map((e: any) => Object.keys(e).length)
  //     .reduce((a: number, b: number) => a + b)
  // );

  return (
    <div className="Content">
      <Stack spacing={2} alignItems="center">
        <Stack spacing={2} direction="row">
          <Gauge
            value={pixelTotal > 0 ? 100 : 0}
            unit="Pixels"
            total={pixelTotal}
            current={pixelTotal}
          />
          <Gauge
            value={Object.keys(devices).length > 0 ? 100 : 0}
            unit="Devices"
            total={Object.keys(devices).length}
            current={Object.keys(devices).length}
            onClick={() => navigate('/Devices')}
          />
          <Gauge
            value={virtualsReal.length > 0 ? 100 : 1}
            unit="Virtuals"
            total={Object.keys(virtuals).length}
            current={virtualsReal.length}
            onClick={() => navigate('/Devices')}
          />
          <Gauge
            unit="User Presets"
            total={Object.values(config.user_presets)
              .map((e: any) => Object.keys(e).length)
              .reduce((a: number, b: number) => a + b)}
            current={Object.values(config.user_presets)
              .map((e: any) => Object.keys(e).length)
              .reduce((a: number, b: number) => a + b)}
          />
        </Stack>
        <Stack spacing={2} direction="row">
          <Gauge
            unit="Pixels online"
            total={pixelTotal}
            current={pixelTotalOnline}
          />
          <Gauge
            unit="Devices online"
            total={Object.keys(devices).length}
            current={Object.keys(devicesOnline).length}
            onClick={() => navigate('/Devices')}
          />
          <Gauge
            unit="Scenes"
            total={Object.keys(scenes).length}
            current={Object.keys(scenes).length}
            onClick={() => navigate('/Scenes')}
          />
          <Gauge
            unit="User Colors"
            total={
              Object.keys(config.user_colors).length +
              Object.keys(config.user_gradients).length
            }
            current={
              Object.keys(config.user_colors).length +
              Object.keys(config.user_gradients).length
            }
          />
        </Stack>

        <SmartBar direct />
        <Stack spacing={2} direction="row">
          <Box sx={{ m: 1, position: 'relative' }}>
            <Tooltip title="Scan for WLED Devices">
              <Fab
                aria-label="scan-wled"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.light,
                  },
                  ...(scanning > -1 && {
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: theme.palette.primary.main,
                    },
                  }),
                }}
                onClick={handleScan}
              >
                {scanning > -1 ? (
                  <Typography
                    variant="caption"
                    style={{ fontSize: 10 }}
                    component="div"
                  >
                    {`${Math.round((scanning / 30) * 100)}%`}
                  </Typography>
                ) : (
                  <BladeIcon name="wled" />
                )}
              </Fab>
            </Tooltip>
            {scanning > -1 && (
              <CircularProgress5
                size={68}
                sx={{
                  color: theme.palette.primary.main,
                  position: 'absolute',
                  top: -6,
                  left: -6,
                  zIndex: 1,
                }}
              />
            )}
          </Box>
          <Tooltip title="Play / Pause LedFx Effect-streaming">
            <Fab
              aria-label="play-pause"
              onClick={() => {
                togglePause();
              }}
              style={{
                margin: '8px',
              }}
              sx={{
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                },
              }}
            >
              {paused ? <PlayArrow /> : <PauseOutlined />}
            </Fab>
          </Tooltip>
          <Tooltip title="Clear Frontend Data">
            <span style={{ margin: 0 }}>
              <Popover
                type="fab"
                color="primary"
                style={{ margin: '8px' }}
                icon={<DeleteForever />}
                text="Delete frontend data?"
                onConfirm={() => {
                  deleteFrontendConfig();
                }}
              />
            </span>
          </Tooltip>
          <Tooltip title="SmartBar (CTRL+ALT+Y/Z)">
            <Fab
              aria-label="smartbar"
              onClick={() => setSmartBarOpen(true)}
              style={{
                margin: '8px',
              }}
              sx={{
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                },
              }}
            >
              <Dvr />
            </Fab>
          </Tooltip>
          <Tooltip title="Guided Tour">
            <span style={{ margin: 0 }}>
              <TourHome className="step-one" variant="fab" />
            </span>
          </Tooltip>
        </Stack>
        <Stack spacing={2} direction="row">
          <Tooltip title="Github Core (python)">
            <Fab
              aria-label="github"
              onClick={() =>
                window.open(
                  'https://github.com/LedFx/LedFx',
                  '_blank',
                  'noopener,noreferrer'
                )
              }
              style={{
                margin: '8px',
              }}
              sx={{
                bgcolor: theme.palette.text.hint,
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                },
              }}
            >
              <GitHub />
            </Fab>
          </Tooltip>
          <Tooltip title="Github Client (react)">
            <Fab
              aria-label="github"
              onClick={() =>
                window.open(
                  'https://github.com/YeonV/LedFx-Frontend-v2',
                  '_blank',
                  'noopener,noreferrer'
                )
              }
              style={{
                margin: '8px',
              }}
              sx={{
                bgcolor: theme.palette.text.hint,
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                },
              }}
            >
              <GitHub />
            </Fab>
          </Tooltip>
          <Tooltip title="Discord">
            <Fab
              aria-label="discord"
              onClick={() =>
                window.open(
                  'https://discord.gg/EZf8pAZ4',
                  '_blank',
                  'noopener,noreferrer'
                )
              }
              style={{
                margin: '8px',
              }}
              sx={{
                bgcolor: theme.palette.text.hint,
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                },
              }}
            >
              <svg
                role="img"
                viewBox="-12 -12 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </Fab>
          </Tooltip>
        </Stack>
      </Stack>
    </div>
  );
};

export default Dashboard;
