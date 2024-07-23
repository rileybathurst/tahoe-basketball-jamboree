export default interface tournamentTypesIndex {
  attributes: {
    name: string;
    games: {
      data: {
        home_team: {
          data: {
            name: string;
          };
        };
        away_team: {
          data: {
            name: string;
          };
        };
        home_team_score: number;
        away_team_score: number;
        round: {
          data: {
            name: string;
          };
        };
        }
      };
    }[];
  };
}
