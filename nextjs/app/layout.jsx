import '../../shared/app.css';

export const metadata = {
  title: 'WeatherNow · Next.js',
  description:
    'WeatherNow: a modern weather experience. Live conditions from OpenWeatherMap.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
