import { useState } from 'react';

const GuestbookPage: React.FC = () => {
  const [guestbookEntries, setGuestbookEntries] = useState<string[]>([]);

  const addEntry = (entry: string) => {
    setGuestbookEntries([...guestbookEntries, entry]);
  };

  const renderGuestbookEntries = () => {
    return guestbookEntries.map((entry, index) => (
      <div key={index}>
        <p>{entry}</p>
      </div>
    ));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const entry = formData.get('entry') as string;
    addEntry(entry);

    event.currentTarget.reset();
  };

  return (
    <div>
      <h1>방명록</h1>
      <form onSubmit={handleSubmit}>
        <textarea name="entry" required />
        <button type="submit">방명록에 추가</button>
      </form>
      <div>{renderGuestbookEntries()}</div>
    </div>
  );
};

export default GuestbookPage;
