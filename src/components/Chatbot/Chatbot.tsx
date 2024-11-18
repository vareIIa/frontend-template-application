import React, { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true); // Controla a barra lateral

  const handleSendMessage = async () => {
    if (!input.trim()) {
      alert('Por favor, insira uma mensagem.');
      return;
    }

    setMessages((prev) => [...prev, `Você: ${input}`]);
    setLoading(true);

    const payload = { message: input };

    try {
      const response = await fetch('http://147.79.111.214:5000/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'b7fe1fd2-7074-4ae0-95ec-23f637695b87',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setLoading(false);
        alert('Falha na comunicação com o chatbot.');
        return;
      }

      const data = await response.json();
      const botResponse = data.response || 'Sem resposta';
      setMessages((prev) => [...prev, `Bot: ${botResponse}`]);
    } catch (error) {
      alert('Erro ao processar sua mensagem. Tente novamente.');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Barra lateral */}
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ padding: 2, backgroundColor: '#1976d2', color: 'white' }}>
          <Typography variant="h6">Menu</Typography>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Chatbot" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Configurações" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Conteúdo principal */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Chatbot
        </Typography>

        <Box
          sx={{
            maxHeight: 300,
            width: '100%',
            maxWidth: 600,
            overflowY: 'auto',
            marginBottom: 2,
            borderWidth: 1,
            borderRadius: 1,
            padding: 2,
            backgroundColor: '#f7f7f7',
          }}
        >
          {messages.map((msg, index) => (
            <Typography key={index} paragraph>
              {msg}
            </Typography>
          ))}
        </Box>

        <Box display="flex" alignItems="center" width="100%" maxWidth={600}>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            label="Digite uma mensagem..."
            variant="outlined"
            fullWidth
            sx={{ marginRight: 2 }}
            disabled={loading}
          />
          <Button
            onClick={handleSendMessage}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
