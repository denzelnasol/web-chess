
## Table Creation
# account
CREATE TABLE account (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID NOT NULL,
  white_player_id UUID,
  black_player_id UUID,
  notation TEXT,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  CONSTRAINT fk_game_owner FOREIGN KEY (owner_id)
    REFERENCES account(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_game_white_player FOREIGN KEY (white_player_id)
    REFERENCES account(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_game_black_player FOREIGN KEY (black_player_id)
    REFERENCES account(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
);

# Set to DB UTC time
Note: Make sure to restart the postgresql server after applying this change
ALTER DATABASE web_chess SET timezone = 'UTC';



