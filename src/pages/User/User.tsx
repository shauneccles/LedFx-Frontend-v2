/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-self-assign */
/* eslint-disable no-alert */
import {
  Badge,
  Box,
  Divider,
  Select,
  Stack,
  Step,
  StepButton,
  Stepper,
  TextField,
  Tooltip,
  useTheme,
  MenuItem
} from '@mui/material'
import {
  AccessTime,
  GitHub,
  CloudDownload,
  CloudUpload,
  EmojiEventsOutlined,
  Star,
  StarOutline
} from '@mui/icons-material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useStore from '../../store/useStore'
import Popover from '../../components/Popover/Popover'

const User = () => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState<string | false>(false)
  const [subExpanded, setSubExpanded] = useState<string | false>(false)
  const [cloudEffects, setCloudEffects] = useState<any>([])
  const [cloudConfigs, setCloudConfigs] = useState<any>([])
  const [configName, setConfigName] = useState('')

  const [starred, setStarred] = useState({
    core: false,
    client: false,
    build: false,
    hass: false,
    wledman: false,
    audiopipes: false,
    io: false
  })
  const [trophies, setTrophies] = useState({
    fan: 0,
    enthusiast: 0,
    contributor: 0
  })
  // const trophies = useStore((state) => state.user.trophies)
  // const setTrophies = useStore((state) => state.user.setTrophies)
  // const starred = useStore((state) => state.user.starred)
  // const setStarred = useStore((state) => state.user.setStarred)
  const getFullConfig = useStore((state) => state.getFullConfig)
  const isLogged = useStore((state) => state.isLogged)
  const importSystemConfig = useStore((state) => state.importSystemConfig)

  const userName = localStorage.getItem('username')

  const cloud = axios.create({
    baseURL: 'https://strapi.yeonv.com'
  })

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }
  const handleChangeSub =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setSubExpanded(isExpanded ? panel : false)
    }
  const getCloudPresets = async () => {
    const response = await cloud.get('presets', {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    })
    if (response.status !== 200) {
      alert('No Access')
      return
    }
    const res = await response.data
    const cEffects = {} as any
    res.forEach((p: { effect: { Name: string } }) => {
      if (!cEffects[p.effect.Name]) cEffects[p.effect.Name] = []
      cEffects[p.effect.Name].push(p)
    })
    setCloudEffects(cEffects)
  }

  const getCloudConfigs = async () => {
    const response = await cloud.get(
      `configs?user.username=${localStorage.getItem('username')}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      }
    )
    if (response.status !== 200) {
      alert('No Access')
      return
    }
    const res = await response.data
    setCloudConfigs(res)
  }

  const hasStarred = async (owner = 'YeonV', repo = 'LedFx-Frontend-v2') => {
    const s = [] as any

    const gettingStars: any = async (index: number = 0) => {
      const r = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/stargazers?per_page=100&page=${index}`
      )
      const re = await r.json()
      s.push(...re)
      if (re.length === 100) {
        gettingStars(index + 1)
      }
      return s
    }

    const theStars = await gettingStars()
    return theStars
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const deleteCloudConfig = async (name: string, date: any) => {
    const existing = await cloud.get(
      `configs?user.username=${localStorage.getItem(
        'username'
      )}&Name=${name}&Date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      }
    )
    const exists = await existing.data
    if (exists.length && exists.length > 0) {
      cloud.delete(`configs/${exists[0].id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })
    }
  }

  useEffect(() => {
    getCloudPresets()
  }, [])

  useEffect(() => {
    getCloudConfigs()
  }, [])

  const filteredCloudEffects = {} as any

  useEffect(() => {
    if (setTrophies) {
      if (starred.core && starred.client && starred.build) {
        setTrophies((s) => ({ ...s, fan: 1 }))
      } else {
        setTrophies((s) => ({ ...s, fan: 0 }))
      }
      if (starred.hass && starred.wledman && starred.audiopipes && starred.io) {
        setTrophies((s) => ({ ...s, enthusiast: 1 }))
      } else {
        setTrophies((s) => ({ ...s, enthusiast: 0 }))
      }
      if (
        Object.keys(filteredCloudEffects)
          .map((effect) => filteredCloudEffects[effect].length)
          .reduce((a, b) => a + b, 0) > 0
      ) {
        setTrophies((s) => ({ ...s, contributor: 1 }))
      } else {
        setTrophies((s) => ({ ...s, contributor: 0 }))
      }
    }
  }, [starred])

  useEffect(() => {
    const promise1 = hasStarred('LedFx', 'LedFx')
    const promise2 = hasStarred()
    const promise3 = hasStarred('YeonV', 'LedFx-Builds')
    const promise4 = hasStarred('YeonV', 'home-assistant-addons')
    const promise5 = hasStarred('YeonV', 'wled-manager')
    const promise6 = hasStarred('YeonV', 'audio-pipes')
    const promise7 = hasStarred('YeonV', 'io')

    Promise.all([
      promise1,
      promise2,
      promise3,
      promise4,
      promise5,
      promise6,
      promise7
    ]).then((values) => {
      setTimeout(() => {
        setStarred({
          core: values[0].filter((r: any) => r.login === userName)?.length > 0,
          client:
            values[1].filter((r: any) => r.login === userName)?.length > 0,
          build: values[2].filter((r: any) => r.login === userName)?.length > 0,
          hass: values[3].filter((r: any) => r.login === userName)?.length > 0,
          wledman:
            values[4].filter((r: any) => r.login === userName)?.length > 0,
          audiopipes:
            values[5].filter((r: any) => r.login === userName)?.length > 0,
          io: values[6].filter((r: any) => r.login === userName)?.length > 0
        })
      }, 3000)
    })
  }, [])

  Object.keys(cloudEffects).forEach((effectGroup) => {
    const filteredEffects = cloudEffects[effectGroup].filter((effect: any) => {
      return effect.user && effect.user.username === userName
    })

    if (filteredEffects.length > 0) {
      filteredCloudEffects[effectGroup] = filteredEffects
    }
  })

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      sx={{ marginBottom: '5rem' }}
    >
      <Stack
        alignItems="center"
        direction="column"
        gap={2}
        maxWidth={300}
        margin="0 auto"
      >
        <GitHub sx={{ fontSize: 'min(25vw, 25vh, 200px)' }} />
        <Typography variant="h5">{userName}</Typography>
        {isLogged ? (
          <Badge
            sx={{ paddingTop: 2 }}
            badgeContent={
              localStorage.getItem('ledfx-cloud-role') === 'authenticated'
                ? 'logged in'
                : localStorage.getItem('ledfx-cloud-role')
            }
            color="primary"
          />
        ) : (
          'Logged out'
        )}
        <div style={{ width: 300 }}>
          <Accordion
            expanded={expanded === 'panel0'}
            onChange={handleChange('panel0')}
          >
            <AccordionSummary
              expandIcon={<>&nbsp;</>}
              aria-controls="panel0bh-content"
              id="panel0bh-header"
              sx={{ pointerEvents: 'none' }}
            >
              <Typography sx={{ width: '60%', flexShrink: 0 }}>User</Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  textAlign: 'right',
                  flexGrow: 1
                }}
              >
                {userName || ''}
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel01'}
            onChange={handleChange('panel01')}
          >
            <AccordionSummary
              expandIcon={<>&nbsp;</>}
              aria-controls="panel01bh-content"
              id="panel01bh-header"
              sx={{ pointerEvents: 'none' }}
            >
              <Typography sx={{ width: '60%', flexShrink: 0 }}>Role</Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  textAlign: 'right',
                  flexGrow: 1
                }}
              >
                {localStorage.getItem('ledfx-cloud-role') === 'authenticated'
                  ? 'logged in'
                  : localStorage.getItem('ledfx-cloud-role')}
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel001'}
            onChange={handleChange('panel001')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel001bh-content"
              id="panel001bh-header"
            >
              <Typography sx={{ width: '60%', flexShrink: 0 }}>
                Trophies
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  textAlign: 'right',
                  flexGrow: 1,
                  paddingRight: 2
                }}
              >
                {trophies.enthusiast + trophies.fan + trophies.contributor}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption" color="GrayText">
                earn trophies and unlock features
              </Typography>
              {/**
               *
               *
               *
               *
               */}
              <Accordion
                expanded={subExpanded === 'sub1'}
                onChange={handleChangeSub('sub1')}
                sx={{ padding: 0 }}
                elevation={0}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="sub1bh-content"
                  id="sub1bh-header"
                  sx={{ padding: 0, alignItems: 'center' }}
                >
                  <Typography
                    sx={{
                      width: '60%',
                      flexShrink: 0,
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    Fan
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'right',
                      flexGrow: 1,
                      paddingRight: 2,
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <EmojiEventsOutlined />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" align="center">
                    star repos to earn trophy
                  </Typography>
                  <EmojiEventsOutlined
                    sx={{
                      fontSize: 150,
                      width: '100%',
                      alignSelf: 'center',
                      color:
                        starred.core && starred.client && starred.build
                          ? theme.palette.primary.main
                          : 'inherit'
                    }}
                  />
                  <Typography>
                    <Box sx={{ width: '100%', zIndex: 1000 }}>
                      <Stepper nonLinear activeStep={1} alternativeLabel>
                        <Step key="core" completed={starred.core}>
                          <StepButton
                            onClick={() => {
                              window.open(
                                'https://github.com/LedFx/LedFx',
                                '_blank'
                              )
                            }}
                            sx={{
                              textTransform: 'capitalize',
                              color: starred.core
                                ? theme.palette.primary.main
                                : 'inherit'
                            }}
                            icon={starred.core ? <Star /> : <StarOutline />}
                          >
                            core
                          </StepButton>
                        </Step>
                        <Step key="client" completed={starred.client}>
                          <StepButton
                            onClick={() => {
                              window.open(
                                'https://github.com/YeonV/LedFx-Frontend-v2',
                                '_blank'
                              )
                            }}
                            sx={{
                              textTransform: 'capitalize',
                              color: starred.client
                                ? theme.palette.primary.main
                                : 'inherit'
                            }}
                            icon={starred.client ? <Star /> : <StarOutline />}
                          >
                            client
                          </StepButton>
                        </Step>
                        <Step key="build" completed={starred.build}>
                          <StepButton
                            onClick={() => {
                              window.open(
                                'https://github.com/YeonV/LedFx-Builds',
                                '_blank'
                              )
                            }}
                            sx={{
                              textTransform: 'capitalize',
                              color: starred.build
                                ? theme.palette.primary.main
                                : 'inherit'
                            }}
                            icon={starred.build ? <Star /> : <StarOutline />}
                          >
                            build
                          </StepButton>
                        </Step>
                      </Stepper>
                    </Box>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={subExpanded === 'sub2'}
                onChange={handleChangeSub('sub2')}
                sx={{ padding: 0, backgroundColor: 'transparent !important' }}
                elevation={0}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="sub2bh-content"
                  id="sub2bh-header"
                  sx={{ padding: 0 }}
                >
                  <Typography
                    sx={{
                      width: '60%',
                      flexShrink: 0,
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    Enthusiast
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'right',
                      flexGrow: 1,
                      paddingRight: 2,
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <EmojiEventsOutlined />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" align="center">
                    star repos to earn trophy
                  </Typography>
                  <EmojiEventsOutlined
                    sx={{
                      fontSize: 150,
                      width: '100%',
                      alignSelf: 'center',
                      color:
                        starred.hass &&
                        starred.wledman &&
                        starred.audiopipes &&
                        starred.io
                          ? theme.palette.primary.main
                          : 'inherit'
                    }}
                  />
                  <Typography>
                    <Box sx={{ width: '100%', zIndex: 1000 }}>
                      <Stepper nonLinear activeStep={1} orientation="vertical">
                        <Step key="hass" completed={starred.hass}>
                          <StepButton
                            onClick={() => {
                              window.open(
                                'https://github.com/YeonV/home-assistant-addons',
                                '_blank'
                              )
                            }}
                            sx={{
                              textTransform: 'capitalize',
                              color: starred.hass
                                ? theme.palette.primary.main
                                : 'inherit'
                            }}
                            icon={starred.hass ? <Star /> : <StarOutline />}
                          >
                            home-assistant-addons
                          </StepButton>
                        </Step>
                        <Step key="wledman" completed={starred.wledman}>
                          <StepButton
                            onClick={() => {
                              window.open(
                                'https://github.com/YeonV/wled-manager',
                                '_blank'
                              )
                            }}
                            sx={{
                              textTransform: 'capitalize',
                              color: starred.wledman
                                ? theme.palette.primary.main
                                : 'inherit'
                            }}
                            icon={starred.wledman ? <Star /> : <StarOutline />}
                          >
                            wled-manager
                          </StepButton>
                        </Step>
                        <Step key="audiopipes" completed={starred.audiopipes}>
                          <StepButton
                            onClick={() => {
                              window.open(
                                'https://github.com/YeonV/audio-pipes',
                                '_blank'
                              )
                            }}
                            sx={{
                              textTransform: 'capitalize',
                              color: starred.audiopipes
                                ? theme.palette.primary.main
                                : 'inherit'
                            }}
                            icon={
                              starred.audiopipes ? <Star /> : <StarOutline />
                            }
                          >
                            audio-pipes
                          </StepButton>
                        </Step>
                        <Step key="io" completed={starred.io}>
                          <StepButton
                            onClick={() => {
                              window.open(
                                'https://github.com/YeonV/io',
                                '_blank'
                              )
                            }}
                            sx={{
                              textTransform: 'capitalize',
                              color: starred.io
                                ? theme.palette.primary.main
                                : 'inherit'
                            }}
                            icon={starred.io ? <Star /> : <StarOutline />}
                          >
                            io
                          </StepButton>
                        </Step>
                      </Stepper>
                    </Box>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={subExpanded === 'sub3'}
                onChange={handleChangeSub('sub3')}
                sx={{ padding: 0, backgroundColor: 'transparent !important' }}
                elevation={0}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="sub3bh-content"
                  id="sub3bh-header"
                  sx={{ padding: 0 }}
                >
                  <Typography
                    sx={{
                      width: '60%',
                      flexShrink: 0,
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    Contributor
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'right',
                      flexGrow: 1,
                      paddingRight: 2,
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <EmojiEventsOutlined />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Create amazing presets and share them</Typography>
                  <EmojiEventsOutlined
                    sx={{
                      fontSize: 150,
                      width: '100%',
                      alignSelf: 'center',
                      color:
                        starred.core && starred.client && starred.build
                          ? theme.palette.primary.main
                          : 'inherit'
                    }}
                  />
                </AccordionDetails>
              </Accordion>

              {/**
               *
               *
               *
               *
               */}
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: '60%', flexShrink: 0 }}>
                Cloud-Presets
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  textAlign: 'right',
                  flexGrow: 1,
                  paddingRight: 2
                }}
              >
                {Object.keys(filteredCloudEffects)
                  .map((effect) => filteredCloudEffects[effect].length)
                  .reduce((a, b) => a + b, 0)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {Object.keys(filteredCloudEffects)
                  .map((effect) => filteredCloudEffects[effect].length)
                  .reduce((a, b) => a + b, 0) === 0
                  ? 'No CloudPresets yet.'
                  : 'Manage your CloudPresets in Device-view'}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography sx={{ width: '60%', flexShrink: 0 }}>
                Cloud-Configs
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  textAlign: 'right',
                  flexGrow: 1,
                  paddingRight: 2
                }}
              >
                {cloudConfigs.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Upload current config</Typography>
                <Popover
                  icon={<CloudUpload />}
                  disabled={cloudConfigs.length >= 5}
                  type="iconbutton"
                  color="inherit"
                  confirmDisabled={configName === ''}
                  onConfirm={() => {
                    getFullConfig().then((c: any) =>
                      cloud
                        .post(
                          'configs',
                          {
                            Name: configName,
                            Date: +new Date(),
                            config: c,
                            user: localStorage.getItem('ledfx-cloud-userid')
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                'jwt'
                              )}`
                            }
                          }
                        )
                        .then(() => getCloudConfigs())
                    )
                  }}
                  content={
                    <TextField
                      value={configName}
                      onChange={(e) => setConfigName(e.target.value)}
                      placeholder="Enter Config Name"
                    />
                  }
                />
              </Stack>
              {cloudConfigs.length > 0 &&
                cloudConfigs.map((c: any) => (
                  <>
                    <Divider />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography>{c.Name}</Typography>

                      <Stack direction="row" alignItems="center">
                        <Popover
                          type="iconbutton"
                          color="inherit"
                          onConfirm={() =>
                            deleteCloudConfig(c.Name, c.Date).then(() =>
                              setTimeout(() => {
                                getCloudConfigs()
                              }, 200)
                            )
                          }
                        />
                        <Tooltip title="Load Config">
                          <Popover
                            onConfirm={() => {
                              importSystemConfig(c.config).then(() => {
                                window.location.href = window.location.href
                              })
                            }}
                            content={
                              <Stack>
                                <Typography
                                  sx={{ padding: '0.5rem 1rem 0 1rem' }}
                                >
                                  overwrite current config?
                                </Typography>
                                <Typography
                                  color="text.disabled"
                                  sx={{ padding: '0 1rem 0.5rem 1rem' }}
                                >
                                  LedFx will restart after
                                </Typography>
                              </Stack>
                            }
                            type="iconbutton"
                            color="inherit"
                            icon={<CloudDownload />}
                          />
                        </Tooltip>

                        <Tooltip
                          title={`Config from ${new Intl.DateTimeFormat(
                            'en-GB',
                            {
                              dateStyle: 'medium',
                              timeStyle: 'medium'
                            }
                          )
                            .format(new Date(c.Date))
                            .split(',')
                            .join(' at ')}`}
                        >
                          <AccessTime sx={{ marginLeft: 1 }} />
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </>
                ))}
            </AccordionDetails>
          </Accordion>
          {(trophies.fan > 0 ||
            trophies.enthusiast > 0 ||
            trophies.contributor > 0) && (
            <Accordion
              expanded={expanded === 'panel3'}
              onChange={handleChange('panel3')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography sx={{ width: '60%', flexShrink: 0 }}>
                  Theme-Selector
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    textAlign: 'right',
                    flexGrow: 1,
                    paddingRight: 2
                  }}
                >
                  {trophies.contributor > 0
                    ? 4
                    : trophies.enthusiast > 0
                      ? 3
                      : 2}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Select
                  value={
                    window.localStorage.getItem('ledfx-theme') || 'DarkBlue'
                  }
                  fullWidth
                  onChange={(e) => {
                    if (e.target.value === 'DarkBlue') {
                      window.localStorage.setItem('ledfx-theme', 'DarkBlue')
                      window.location.reload()
                    } else if (e.target.value === 'DarkOrange') {
                      window.localStorage.setItem('ledfx-theme', 'DarkOrange')
                      window.location.reload()
                    } else if (e.target.value === 'DarkGreen') {
                      window.localStorage.setItem('ledfx-theme', 'DarkGreen')
                      window.location.reload()
                    } else if (e.target.value === 'DarkRed') {
                      window.localStorage.setItem('ledfx-theme', 'DarkRed')
                      window.location.reload()
                    }
                  }}
                >
                  <MenuItem value="DarkBlue">Blade&apos;s Blue</MenuItem>
                  <MenuItem value="DarkOrange">Blade&apos;s Orange</MenuItem>
                  {(trophies.enthusiast > 0 || trophies.contributor > 0) && (
                    <MenuItem value="DarkGreen">Blade&apos;s Green</MenuItem>
                  )}
                  {trophies.contributor > 0 && (
                    <MenuItem value="DarkRed">Blade&apos;s Red</MenuItem>
                  )}
                </Select>
              </AccordionDetails>
            </Accordion>
          )}
        </div>
      </Stack>
    </Box>
  )
}

export default User
