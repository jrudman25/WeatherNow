import '../../shared/app.css';

export const metadata = {
  title: 'WeatherNow · Next.js',
  description:
    'WeatherNow: a modern weather experience. Live conditions from OpenWeatherMap.',
};

export const viewport = {
  themeColor: '#0b0d12',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
