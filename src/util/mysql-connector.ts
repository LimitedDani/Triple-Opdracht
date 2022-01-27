import "dotenv/config";
import * as mysql from "mysql";
import Connection from "mysql/lib/Connection";
import { Configuration } from "../objects/configuration";

export class MySql {
  private connection: Connection;
  private configuration: Configuration;
  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  /**
   * @return { Promise<Connection> } gets the mysql connection
   */
  public async getConnection(): Promise<Connection> {
    return this.connection;
  }

  /**
   * @return { Promise<Connection> } Creates the mysql connection
   */
  public async createConnection(): Promise<Connection> {
    this.connection = mysql.createConnection({
      host: this.configuration.host,
      user: this.configuration.user,
      password: this.configuration.password,
      database: this.configuration.database,
    });
    await this.connection.connect(function (err) {
      if (err) {
        console.error("error connecting: " + err.stack);
        return;
      }
      console.info("MySQL Connected");
    });
  }
}
