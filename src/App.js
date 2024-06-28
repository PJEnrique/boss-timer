import React, { useState } from 'react';
import { Anggolt, Kiaron, Grish, Inferno } from './data';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedBoss, setSelectedBoss] = useState('');
  const [spawnTime, setSpawnTime] = useState('');

  const handleSelectChange = (event) => {
    setSelectedBoss(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSpawnTime(event.target.value);
  };

  const calculateNextSpawn = (deadTime, interval) => {
    const deadDate = new Date(deadTime);
    const nextSpawn = new Date(deadDate);
    nextSpawn.setHours(deadDate.getHours() + interval);

    // Convert to Philippine Time
    const nextSpawnInPHT = new Date(nextSpawn.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));

    // Format date to string
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZone: 'Asia/Manila', 
      timeZoneName: 'short' 
    };
    const formattedDate = nextSpawnInPHT.toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const handleSubmit = () => {
    let interval;
    if (Anggolt.includes(selectedBoss)) interval = 4;
    else if (Kiaron.includes(selectedBoss)) interval = 5;
    else if (Grish.includes(selectedBoss)) interval = 6;
    else if (Inferno.includes(selectedBoss)) interval = 7;

    const nextSpawnTime = calculateNextSpawn(spawnTime, interval);
    notifyDiscord(nextSpawnTime);
  
    // Reset selection and time after notifying
    setSelectedBoss('');
    setSpawnTime('');
  };

  const notifyDiscord = (nextSpawnTime) => {
    let webhookURL = '';

    // Select webhook URL based on selected boss
    if (Anggolt.includes(selectedBoss)) {
      webhookURL = 'https://discord.com/api/webhooks/1253199712576868374/5C5aLDar4gKLgcULWY0Bnl3b-yqDsyGqljJYydbsLNVYgpnk3YBPdqJ-QXiCGQiQipSF';
    } else if (Kiaron.includes(selectedBoss)) {
      webhookURL = 'https://discord.com/api/webhooks/1256270377995206669/VtEwGdoHYvw4I4A9Ox4RbnQrO7MdQFTRIVwSG4mPfs3lbk3FGYAHIETqCiIqw62krtis';
    } else if (Grish.includes(selectedBoss)) {
      webhookURL = 'https://discord.com/api/webhooks/1256270549009563730/XM5csVR6EEbU45RAXosRvF2f5LqTZSLoRkwdnNbHADFNtI1bf2h00hg96-To4KsWeLYr';
    } else if (Inferno.includes(selectedBoss)) {
      webhookURL = 'https://discord.com/api/webhooks/1256270699517972642/dk9dN1q-NTagp0NSo_XcWkxiTOU9x6Bmqk1oQhmnAAsrCQ-8Wd55UNtVhpJMuWzGRmYE';
    } else {
      // Handle case where no boss is selected or webhook URL is not specified
      console.error('Invalid boss selection or webhook URL not specified.');
      return;
    }

    // Post notification to Discord
    axios.post(webhookURL, {
      content: `The next spawn time for ${selectedBoss} is at ${nextSpawnTime} Philippine Time`
    }).then(response => {
      console.log('Notification sent successfully', response);
    }).catch(error => {
      console.error('Error sending notification', error);
    });
  };

  return (
    <div className="container">
      <h1>Boss Timer</h1>
      <TableContainer component={Paper} className="table-container">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>Boss</TableCell>
              <TableCell>Dead Time</TableCell>
              <TableCell>Next Spawn Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Select value={selectedBoss} onChange={handleSelectChange} className="select">
                  <MenuItem disabled value=""><em>Select Anggolt</em></MenuItem>
                  {Anggolt.map(boss => (
                    <MenuItem key={boss} value={boss}>{boss}</MenuItem>
                  ))}
                  <MenuItem disabled value=""><em>Select Kiaron</em></MenuItem>
                  {Kiaron.map(boss => (
                    <MenuItem key={boss} value={boss}>{boss}</MenuItem>
                  ))}
                  <MenuItem disabled value=""><em>Select Grish</em></MenuItem>
                  {Grish.map(boss => (
                    <MenuItem key={boss} value={boss}>{boss}</MenuItem>
                  ))}
                  <MenuItem disabled value=""><em>Select Inferno</em></MenuItem>
                  {Inferno.map(boss => (
                    <MenuItem key={boss} value={boss}>{boss}</MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <TextField type="datetime-local" value={spawnTime} onChange={handleTimeChange} className="text-field" />
              </TableCell>
              <TableCell className="button">
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Calculate and Notify
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
