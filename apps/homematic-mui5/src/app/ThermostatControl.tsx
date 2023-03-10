import {
  Box,
  IconButton,
  ListItemText,
  Slider,
  Typography,
} from '@mui/material';

import { useGetParamSet, useSetValueMutation } from '../hooks/useApi';
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined';
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto';
import WaterDamageOutlinedIcon from '@mui/icons-material/WaterDamageOutlined';
import { useEffect, useState } from 'react';

interface ControlProps {
  interfaceName: string;
  address: string;
  name: string;
}

interface ThermostatResponse {
  ACTIVE_PROFILE: string;
  ACTUAL_TEMPERATURE: string;
  ACTUAL_TEMPERATURE_STATUS: string;
  BOOST_MODE: string;
  BOOST_TIME: string;
  FROST_PROTECTION: string;
  HEATING_COOLING: string;
  HUMIDITY: string;
  HUMIDITY_STATUS: string;
  PARTY_MODE: string;
  QUICK_VETO_TIME: string;
  SET_POINT_MODE: string;
  SET_POINT_TEMPERATURE: string;
  SWITCH_POINT_OCCURED: string;
  WINDOW_STATE: string;
}

export const ThermostatControl = ({
  name,
  address,
  interfaceName,
}: ControlProps) => {
  const marks = [
    {
      value: 10,
      label: '10°C',
    },

    {
      value: 20,
      label: '20°C',
    },

    {
      value: 30,
      label: '30°C',
    },
  ];

  const setValueMutation = useSetValueMutation();
  const response = useGetParamSet<ThermostatResponse>(interfaceName, address);
  const result = response.data?.data.result;
  const setPoinTemperatureResult = Number(result?.SET_POINT_TEMPERATURE ?? 0);
  const [pointTemp, setPointTemp] = useState<number>(setPoinTemperatureResult);
  const setPointModeResult = Number(result?.SET_POINT_MODE ?? 0);
  const [pointMode, setPointMode] = useState<number>(setPointModeResult);

  useEffect(() => {
    setPointMode(setPointModeResult);
  }, [setPointModeResult]);

  useEffect(() => {
    setPointTemp(setPoinTemperatureResult);
  }, [setPoinTemperatureResult]);

  return (
    <>
      <ThermostatOutlinedIcon
        sx={{
          color:
            Number(result?.ACTUAL_TEMPERATURE) < 15
              ? 'blue'
              : Number(result?.ACTUAL_TEMPERATURE) > 15 &&
                Number(result?.ACTUAL_TEMPERATURE) < 20
              ? 'orange'
              : 'red',
        }}
      />
      <ListItemText
        primary={name}
        sx={{
          marginLeft: '10px',
          '& .MuiListItemText-primary': {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          },
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WaterDamageOutlinedIcon sx={{ marginRight: '3px' }} />
            <Typography variant="caption" sx={{ mr: 1 }}>
              {result?.HUMIDITY ? Number(result?.HUMIDITY) : null}%
            </Typography>
            <IconButton
              sx={{ padding: 0, color: 'black' }}
              onClick={() => {
                setPointMode(Number(pointMode ? '0' : '1'));
                setValueMutation.mutateAsync({
                  interface: interfaceName,
                  address,
                  valueKey: 'CONTROL_MODE',
                  type: 'double',
                  value: pointMode ? 0 : 1,
                });
              }}
            >
              {pointMode ? <ThermostatOutlinedIcon /> : <ThermostatAutoIcon />}
            </IconButton>
            <Typography variant="caption" sx={{}}>
              {result?.ACTUAL_TEMPERATURE
                ? Number(result?.ACTUAL_TEMPERATURE).toLocaleString('de-DE', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })
                : null}
              °C
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: 150 }}>
          <Slider
            aria-label="Temperature"
            defaultValue={30}
            getAriaValueText={(value: number) => `${value}°C`}
            getAriaLabel={(value: number) => `${value}°C`}
            valueLabelDisplay="auto"
            value={pointTemp}
            onChange={(_, value) => {
              setPointTemp(value as number);
              setValueMutation.mutateAsync({
                interface: interfaceName,
                address,
                valueKey: 'SET_POINT_TEMPERATURE',
                type: 'double',
                value: value.toString(),
              });
            }}
            step={1}
            marks={marks}
            min={5}
            max={30}
            sx={{
              '& .MuiSlider-markLabel': {
                fontSize: '11px',
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
};
